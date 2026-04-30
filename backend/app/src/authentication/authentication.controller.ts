import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SupabaseAuthenticationGuard } from './supabase-authentication.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  async signIn(@Body() credentials: Entity.SignInCredentials) {
    return this.authenticationService.signIn(credentials);
  }

  @Post('sign-up')
  async signUp(@Body() credentials: Entity.SignUpCredentials) {
    return this.authenticationService.signUp(credentials);
  }

  @Get('session')
  async getSession(@Headers('authorization') authorizationHeader: string) {
    const token = authorizationHeader?.slice(7) ?? '';
    return this.authenticationService.getSession(token);
  }

  @Post('refresh')
  async refreshSession(@Body() payload: Entity.RefreshTokenPayload) {
    return this.authenticationService.refreshSession(payload);
  }

  @Post('sign-out')
  @UseGuards(SupabaseAuthenticationGuard)
  async signOut(@Headers('authorization') authorizationHeader: string) {
    const token = authorizationHeader?.replace('Bearer ', '') ?? '';
    return this.authenticationService.signOut(token);
  }
}
