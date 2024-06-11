import { UserRole } from 'src/users/user-role.enum';

export interface JwtPayload {
  email: string;
  sub: number;
  role: UserRole;
}
