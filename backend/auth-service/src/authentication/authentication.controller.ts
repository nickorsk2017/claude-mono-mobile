import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInCredentials, SignUpCredentials } from './authentication.types';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  async signIn(@Body() credentials: SignInCredentials) {
    return this.authenticationService.signIn(credentials);
  }

  @Post('sign-up')
  async signUp(@Body() credentials: SignUpCredentials) {
    return this.authenticationService.signUp(credentials);
  }

  @Post('sign-out')
  async signOut(@Headers('authorization') authorizationHeader: string) {
    const token = authorizationHeader?.replace('Bearer ', '') ?? '';
    return this.authenticationService.signOut(token);
  }
}
