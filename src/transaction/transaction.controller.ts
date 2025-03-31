import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/create-transaction.dto';
import { UserID } from 'src/config/userID';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/transfer')
  create(@Body() createTransactionDto: TransactionDto, @UserID() id: string) {
    return this.transactionService.create(createTransactionDto, id);
  }

  @Get('history')
  async getLastTransactions() {
    return this.transactionService.getLastTransactions();
  }
}
