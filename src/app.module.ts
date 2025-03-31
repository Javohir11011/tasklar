import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BycrptService } from './config/bycrpt/bycrpt.service';
import { UserModule } from './user/user.module';
import { CustomJwtModule } from './config/jwt/jwt.module';
import { RolesModule } from './config/guards/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.URL || 'mongodb://localhost:27017/db'),
    AuthModule,
    UserModule,
    CustomJwtModule,
    RolesModule,
  ],
  controllers: [],
  providers: [BycrptService],
})
export class AppModule {}
