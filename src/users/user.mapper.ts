import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

export const toUserEntity = (createUserDto: CreateUserDto): User => {
  const user = new User();
  user.email = createUserDto.email;
  user.password = createUserDto.password;
  user.role = createUserDto.role;
  return user;
};
