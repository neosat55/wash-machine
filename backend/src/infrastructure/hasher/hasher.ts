import {hash, compare} from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HasherBcrypt {
  async encrypt(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}