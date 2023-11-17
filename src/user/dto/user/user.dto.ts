import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  constructor(id: number, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
  }

  /**
   * User id
   * @example '1'
   */
  id: number;

  /**
   * User email
   * @example 'john@doe.com'
   */
  @IsString({ message: 'Should be string' })
  @IsNotEmpty({ message: 'Shouldn`t be empty' })
  @IsEmail({}, { message: 'Should be email' })
  @MaxLength(200)
  email: string;

  /**
   * User password
   * @example 'qwerty'
   */
  @IsString({ message: 'Should be string' })
  @IsNotEmpty({ message: 'Shouldn`t be empty' })
  @MinLength(6)
  @MaxLength(200)
  password: string;

  /**
   * Username
   * @example 'John Doe'
   */
  @IsString({ message: 'Should be string' })
  @IsNotEmpty({ message: 'Shouldn`t be empty' })
  @MaxLength(300)
  name: string;
}
