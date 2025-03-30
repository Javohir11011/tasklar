import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BycrptService {
  async encrypt(password: string): Promise<string> {
    const salt = 5;
    return await bcrypt.hash(password, salt);
  }
  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
