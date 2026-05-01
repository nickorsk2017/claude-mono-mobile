import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  async signIn(
    @Body() credentials: Entity.SignInCredentials,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authenticationService.signIn(credentials);
    if (result.success && result.data) {
      response.cookie(REFRESH_TOKEN_COOKIE, result.data.refreshToken, refreshCookieOptions);
    }
    return result;
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
  async refreshSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = (request.cookies as Record<string, string>)?.[REFRESH_TOKEN_COOKIE] ?? '';
    const result = await this.authenticationService.refreshSession({ refreshToken });
    if (result.success && result.data) {
      response.cookie(REFRESH_TOKEN_COOKIE, result.data.refreshToken, refreshCookieOptions);
    }
    return result;
  }

  @Post('sign-out')
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('authorization') authorizationHeader: string,
  ) {
    response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
    const token = authorizationHeader?.slice(7) ?? '';
    if (!token) return { success: true, data: null, error: null };
    return this.authenticationService.signOut(token);
  }
}
