import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserID } from 'src/config/userID';
import { Role } from 'src/config/role/role';
import { Roles } from 'src/config/guards/role.deco';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/me/balance')
  findOne(@UserID() id: string) {
    return this.userService.findOne(id);
  }

  @Patch('/me/deposit')
  update(
    @Param('id') @UserID() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
