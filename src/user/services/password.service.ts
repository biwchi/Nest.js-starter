import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as CryptoJs from 'crypto-js';

@Injectable()
export class PasswordService {
  constructor(private readonly configServive: ConfigService) {}

  public encrypt(password: string) {
    return CryptoJs.AES.encrypt(
      password,
      this.configServive.get('PRIVATE_KEY'),
    ).toString();
  }

  public decrypt(encryptedPassword: string) {
    const bytes = CryptoJs.AES.decrypt(
      encryptedPassword,
      this.configServive.get('PRIVATE_KEY'),
    );

    return bytes.toString(CryptoJs.enc.Utf8);
  }
}
