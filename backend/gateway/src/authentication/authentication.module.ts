import { Module } from '@nestjs/common';
import { SupabaseAuthenticationGuard } from './supabase-authentication.guard';

@Module({
  providers: [SupabaseAuthenticationGuard],
  exports: [SupabaseAuthenticationGuard],
})
export class AuthenticationModule {}
