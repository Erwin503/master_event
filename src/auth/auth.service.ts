import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { ValidatedUserDto } from './dto/validated-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUserDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: ValidatedUserDto) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    console.log('auth service login: ', payload);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token: this.jwtService.sign(payload),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = { ...createUserDto, password: hashedPassword };
    const user = await this.usersService.create(newUser);
    const access_token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      role: user.role,
    });
    return { access_token };
  }
}
