import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user/user.dto';

@Injectable()
export class UserMapper {
  public toItemDto(entity: User) {
    return new UserDto(entity.id, entity.email, entity.name);
  }
}
