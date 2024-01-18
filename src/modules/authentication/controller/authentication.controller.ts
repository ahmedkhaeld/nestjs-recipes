import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.gaurd';
import { AuthenticationService } from '../service/authentication.service';
import { SuccessResponse } from 'src/common/responses/http-responses/success.response';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    const user = req.user;

    const response = await this.authService.login(user);

    return new SuccessResponse(response.data);
  }
}
