import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ValidatedUserDto } from 'src/auth/dto/validated-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string): Promise<ValidatedUserDto> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('local strategy: ', user);
    return user;
  }
}
