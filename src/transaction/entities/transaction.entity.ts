import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@Schema({ timestamps: true })
export class TransactionEntity {
  @Prop({ required: true })
  fromUserId: string;

  @Prop({ required: true })
  toUserId: string;

  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const TransactionSchema =
  SchemaFactory.createForClass(TransactionEntity);
