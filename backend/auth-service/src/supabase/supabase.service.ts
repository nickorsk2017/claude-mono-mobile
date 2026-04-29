import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY')!;
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  get authClient(): SupabaseClient {
    return this.client;
  }
}
