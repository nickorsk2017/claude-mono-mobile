import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<Entity.ApiResponse<{ user: Entity.User; session: Entity.SupabaseSession }>> {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error || !data.user || !data.session) {
    return { success: false, data: null as never, error: error?.message ?? 'Sign-in failed' };
  }

  const user: Entity.User = {
    id: data.user.id,
    email: data.user.email ?? '',
    displayName: data.user.user_metadata?.['displayName'] ?? '',
    avatarUrl: data.user.user_metadata?.['avatarUrl'] ?? null,
    createdAt: data.user.created_at,
    updatedAt: data.user.updated_at ?? data.user.created_at,
  };

  const session: Entity.SupabaseSession = {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at ?? 0,
    userId: data.user.id,
  };

  return { success: true, data: { user, session }, error: null };
}

export async function signOut(): Promise<Entity.ApiResponse<null>> {
  const { error } = await supabaseClient.auth.signOut();
  if (error) return { success: false, data: null, error: error.message };
  return { success: true, data: null, error: null };
}

export async function getActiveSession(): Promise<Entity.ApiResponse<Entity.SupabaseSession | null>> {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) return { success: false, data: null, error: error.message };
  if (!data.session) return { success: true, data: null, error: null };

  const session: Entity.SupabaseSession = {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at ?? 0,
    userId: data.session.user.id,
  };

  return { success: true, data: session, error: null };
}
