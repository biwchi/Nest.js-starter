import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserSignInDto extends PickType(UserDto, ['email', 'password']) {}