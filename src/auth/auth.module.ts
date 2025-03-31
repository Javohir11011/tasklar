import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BycrptService } from 'src/config/bycrpt/bycrpt.service';
import { CustomJwtModule } from 'src/config/jwt/jwt.module';
import { UserSchema } from 'src/user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CustomJwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BycrptService],
  exports: [MongooseModule],
})
export class AuthModule {}
