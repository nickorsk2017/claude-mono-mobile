import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  ServiceResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '../response/response.builder';
import {
  SignInCredentials,
  SignUpCredentials,
  AuthenticationTokens,
} from './authentication.types';

@Injectable()
export class AuthenticationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn(credentials: SignInCredentials): Promise<ServiceResponse<AuthenticationTokens>> {
    const { data, error } = await this.supabaseService.authClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session) {
      return buildErrorResponse(error?.message ?? 'Sign in failed');
    }

    return buildSuccessResponse({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
    });
  }

  async signUp(credentials: SignUpCredentials): Promise<ServiceResponse<{ userId: string }>> {
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
