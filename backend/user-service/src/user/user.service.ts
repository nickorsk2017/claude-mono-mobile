import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  ServiceResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '../response/response.builder';
import { UserProfile, UpdateUserProfilePayload } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findProfileById(userId: string): Promise<ServiceResponse<UserProfile>> {
    const { data, error } = await this.supabaseService.adminClient
      .from('profiles')
      .select('id, email, display_name, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return buildErrorResponse(error?.message ?? 'User not found');
    }

    return buildSuccessResponse(this.mapRowToProfile(data));
  }

  async updateProfile(
    userId: string,
    payload: UpdateUserProfilePayload,
  ): Promise<ServiceResponse<UserProfile>> {
    const updateData: Record<string, unknown> = {};

    if (payload.displayName !== undefined) {
      updateData['display_name'] = payload.displayName;
    }

    const { data, error } = await this.supabaseService.adminClient
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, display_name, created_at')
      .single();

    if (error || !data) {
      return buildErrorResponse(error?.message ?? 'Update failed');
    }

    return buildSuccessResponse(this.mapRowToProfile(data));
  }

  private mapRowToProfile(row: Record<string, unknown>): UserProfile {
    return {
      id: String(row['id']),
      email: String(row['email']),
      displayName: String(row['display_name']),
      createdAt: String(row['created_at']),
    };
  }
}
