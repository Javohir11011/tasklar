import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  async create(dto: TransactionDto, id: string) {
    const { toUserId, amount } = dto;
    if (amount < 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const sender = await this.userModel.findById(id);
    if (!sender) throw new NotFoundException('Sender not found');

    const receiver = await this.userModel.findById(toUserId);
    if (!receiver) throw new NotFoundException('Receiver not found');

    if (sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = new this.transactionModel({
      fromUserId: id,
      toUserId,
      amount,
      type: TransactionType.TRANSFER,
    });
    await transaction.save();

    return transaction;
  }

  async getLastTransactions() {
    return this.transactionModel.find().sort({ createdAt: -1 }).limit(10);
  }
}
