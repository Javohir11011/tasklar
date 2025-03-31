import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  TransactionEntity,
  TransactionType,
} from './entities/transaction.entity';
import { TransactionDto } from './dto/create-transaction.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserEntity>,
    @InjectModel('Transaction')
    private transactionModel: Model<TransactionEntity>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(dto: TransactionDto, id: string) {
    const { toUserId, amount } = dto;
    if (amount < 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const sender = await this.userModel.findById(id).session(session);
      if (!sender) throw new NotFoundException('Sender not found');

      const receiver = await this.userModel.findById(toUserId).session(session);
      if (!receiver) throw new NotFoundException('Receiver not found');

      if (sender.balance < amount) {
        throw new BadRequestException('Insufficient  balance ');
      }

      sender.balance -= amount;
      receiver.balance += amount;

      await sender.save({ session });
      await receiver.save({ session });

      const transaction = new this.transactionModel({
        id,
        toUserId,
        amount,
        type: TransactionType.TRANSFER,
      });

      await transaction.save();

      await session.commitTransaction();
      session.endSession();
      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getLastTransactions() {
    return this.transactionModel.find().sort({ createdAt: -1 }).limit(10);
  }
}
