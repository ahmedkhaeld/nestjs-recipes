import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    //super take in other startegy configuration options
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const response = await this.authService.validateUser(username, password);

    if (response.error) {
      console.error(response.error);
      throw new UnauthorizedException(response.error);
    }

    return response.data.user;
  }
}
