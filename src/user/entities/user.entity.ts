import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/config/role/role';

@Schema({ timestamps: true })
export class UserEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 0, min: 0 })
  balance: number;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
