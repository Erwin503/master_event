import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  birth_date?: Date;

  address?: string;
  password?: string;
}
