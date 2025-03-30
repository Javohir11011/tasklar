import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BycrptService } from 'src/config/bycrpt/bycrpt.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { TokenService } from 'src/config/jwt/creatJwt.service';
import { UserDto } from 'src/user/dto/create-user.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly authModel: Model<Auth>,
    private readonly bcryptService: BycrptService,
    private readonly jwtService: TokenService,
  ) {}

  async register(dto: UserDto) {
    const userEmail = await this.authModel.findOne({ email: dto.email });
    if (userEmail) {
      throw new ConflictException('Email already exists');
    }
    const password = await this.bcryptService.encrypt(dto.password);
    const newUser = new this.authModel({ ...dto, password });
    const savedUser = await newUser.save();
    const { password: _, ...result } = savedUser.toObject();

    return result;
  }

  async login(data: LoginAuthDto) {
    const user = await this.authModel
      .findOne({ email: data.email })
      .select('+password');

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const checkPassword = await this.bcryptService.compare(
      data.password,
      user.password,
    );

    if (!checkPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.createAccessToken(payload);
    const refreshToken = this.jwtService.createRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
