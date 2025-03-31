import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class TransactionDto {
  // @IsNotEmpty()
  // @IsString()
  // fromUserId: string;

  @IsNotEmpty()
  @IsString()
  toUserId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than zero' })
  amount: number;
}
