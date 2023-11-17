import { OmitType, PartialType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';
import { IsJWT, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto extends PartialType(
  OmitType(UserCreateDto, ['email', 'password']),
) {
  /**
   * Refresh-token
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
   */
  @IsOptional()
  @IsString({ message: 'Should be string' })
  @IsNotEmpty({ message: 'Should`n be empty' })
  @IsJWT({ message: 'Should be JWT string' })
  refresh_token?: string;
}
