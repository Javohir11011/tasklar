import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserEntity>,
  ) {}
  create(createUserDto: UserDto) {
    
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'ok',
      balance: user.balance,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (
      typeof updateUserDto.balance !== 'undefined' &&
      updateUserDto.balance < 0
    ) {
      throw new BadRequestException('Balance cannot be negative');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    return {
      message: 'updated',
      name: updateUser?.name,
      balance: updateUser?.balance,
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deleteUser = await this.userModel.findByIdAndDelete(id);
    return {
      message: 'deleted',
      user: deleteUser?.name,
    };
  }
}
