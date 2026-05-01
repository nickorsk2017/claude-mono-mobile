import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

function resolveAccessTokenMaxAge(expiresAt: number | undefined): number {
  if (!expiresAt) {
    return 60 * 60 * 1000;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiresAtInSeconds = expiresAt > 10_000_000_000 ? Math.floor(expiresAt / 1000) : expiresAt;
  const computedMaxAgeInSeconds = expiresAtInSeconds - nowInSeconds;

  return (computedMaxAgeInSeconds > 0 ? computedMaxAgeInSeconds : 1) * 1000;
}

function buildCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge,
    path: '/',
  };
}

function setAuthenticationCookies(response: Response, session: Entity.AuthenticationTokens): void {
  response.cookie(
    ACCESS_TOKEN_COOKIE,
    session.accessToken,
    buildCookieOptions(resolveAccessTokenMaxAge(session.expiresAt)),
  );
  response.cookie(
    REFRESH_TOKEN_COOKIE,
    session.refreshToken,
    buildCookieOptions(THIRTY_DAYS_IN_MILLISECONDS),
  );
}

function clearAuthenticationCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
}

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
      setAuthenticationCookies(response, result.data);
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
      setAuthenticationCookies(response, result.data);
    }

    return result;
  }

  @Post('sign-out')
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('authorization') authorizationHeader: string,
  ) {
    clearAuthenticationCookies(response);
    const token = authorizationHeader?.slice(7) ?? '';

    if (!token) {
      return { success: true, data: null, error: null };
    }

    return this.authenticationService.signOut(token);
  }
}
