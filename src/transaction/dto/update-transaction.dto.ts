import { PartialType } from '@nestjs/mapped-types';
import { TransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(TransactionDto) {}
