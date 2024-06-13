import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user-role.enum';

export class ValidatedUserDto {
  id: number;
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  phone: string;

  birth_date: Date;

  address: string;
}
