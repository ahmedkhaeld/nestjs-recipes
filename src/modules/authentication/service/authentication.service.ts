import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IServiceResponse } from 'src/common/interfaces/service.response';
import { UserService } from 'src/modules/user/service/user.service';
import {
  ITokenPayload,
  UserTokenPayload,
} from '../payload/users-token.payload';
import * as bcryptjs from 'bcryptjs';
import { TokenTypes } from '../constant/token-type.constant';
import { UserScopes } from '../constant/user-scope.constant';
@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const response: IServiceResponse = { data: null, error: null };
    const userServiceResponse = await this.userService.GetUserByEmail(email);
    const userData = userServiceResponse.data.user;

    if (userData === null) {
      response.error = 'User not found';
      return response;
    }

    //check the password
    if (userData && userData.password) {
      const isCorrectPassword = bcryptjs.compareSync(
        password,
        userData.password,
      );
      if (isCorrectPassword === false) {
        response.error = 'Password incorrect';
        return response;
      }
    }

    response.data = {
      user: userData,
    };
    return response;
  }

  async login(user: any): Promise<any> {
    const serviceResponse: IServiceResponse = { data: null, error: null };

    const tokenPayload: ITokenPayload = new UserTokenPayload(
      user._id,
      TokenTypes.AdminUser,
      user.email,
      [UserScopes.AdminUser],
    );
    const token = this.jwtService.sign(tokenPayload.getTokenPayload());
    serviceResponse.data = {
      user: user,
      access_token: token,
    };

    return serviceResponse;
  }
}
