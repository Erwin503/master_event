import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  phone: string;

  birth_date: Date;

  address: string;
}
