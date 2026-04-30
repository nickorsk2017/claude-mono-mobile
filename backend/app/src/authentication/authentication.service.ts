import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../providers';
import {
  ServiceResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '../utils/response.builder';

@Injectable()
export class AuthenticationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn(
    credentials: Entity.SignInCredentials,
  ): Promise<ServiceResponse<Entity.AuthenticationResponse>> {
    const { data, error } = await this.supabaseService.authClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      return buildErrorResponse(error?.message ?? 'Sign in failed');
    }

    return buildSuccessResponse({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: data.user.user_metadata?.['display_name'] ?? '',
        createdAt: data.user.created_at,
      },
    });
  }

  async signUp(credentials: Entity.SignUpCredentials): Promise<ServiceResponse<{ userId: string }>> {
    const { data, error } = await this.supabaseService.authClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { data: { display_name: credentials.displayName } },
    });

    if (error || !data.user) {
      return buildErrorResponse(error?.message ?? 'Sign up failed');
    }

    return buildSuccessResponse({ userId: data.user.id });
  }

  async getSession(accessToken: string): Promise<ServiceResponse<Entity.AuthenticationUserProfile>> {
    try {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        return buildErrorResponse('Invalid token format');
      }

      const payloadJson = Buffer.from(tokenParts[1], 'base64url').toString('utf-8');
      const payload = JSON.parse(payloadJson) as {
        sub?: string;
        email?: string;
        exp?: number;
        iat?: number;
        user_metadata?: { display_name?: string };
      };

      if (!payload.sub) {
        return buildErrorResponse('Invalid token');
      }

      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowInSeconds) {
        return buildErrorResponse('Session expired');
      }

      return buildSuccessResponse({
        id: payload.sub,
        email: payload.email ?? '',
        displayName: payload.user_metadata?.display_name ?? '',
        createdAt: new Date((payload.iat ?? 0) * 1000).toISOString(),
      });
    } catch {
      return buildErrorResponse('Invalid or expired session');
    }
  }

  async refreshSession(
    payload: Entity.RefreshTokenPayload,
  ): Promise<ServiceResponse<Entity.AuthenticationResponse>> {
    const { data, error } = await this.supabaseService.authClient.auth.refreshSession({
      refresh_token: payload.refreshToken,
    });

    if (error || !data.session || !data.user) {
      return buildErrorResponse(error?.message ?? 'Session refresh failed');
    }

    return buildSuccessResponse({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: data.user.user_metadata?.['display_name'] ?? '',
        createdAt: data.user.created_at,
      },
    });
  }

  async signOut(accessToken: string): Promise<ServiceResponse<null>> {
    const supabaseClient = this.supabaseService.authClient;

    await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    });

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return buildErrorResponse(error.message);
    }

    return buildSuccessResponse(null);
  }
}
