import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
  process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
);

function mapSessionFromSupabase(session: {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: { id: string };
}): Entity.SupabaseSession {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
    userId: session.user.id,
  };
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
): Promise<Entity.ApiResponse<{ user: Entity.User; session: Entity.SupabaseSession }>> {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) {
    return { success: false, data: null as never, error: error?.message ?? 'Sign-in failed' };
  }
  const user: Entity.User = {
    id: data.user.id,
    email: data.user.email ?? '',
    displayName: data.user.user_metadata?.['display_name'] ?? '',
    avatarUrl: data.user.user_metadata?.['avatar_url'] ?? null,
    createdAt: data.user.created_at,
    updatedAt: data.user.updated_at ?? data.user.created_at,
  };
  return { success: true, data: { user, session: mapSessionFromSupabase(data.session) }, error: null };
}

export async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string,
): Promise<Entity.ApiResponse<{ userId: string }>> {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error || !data.user) {
    return { success: false, data: null as never, error: error?.message ?? 'Sign-up failed' };
  }
  return { success: true, data: { userId: data.user.id }, error: null };
}

export async function signInWithGoogle(): Promise<Entity.ApiResponse<null>> {
  const redirectUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl },
  });
  if (error) return { success: false, data: null, error: error.message };
  return { success: true, data: null, error: null };
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
  return { success: true, data: mapSessionFromSupabase(data.session), error: null };
}

export async function refreshActiveSession(): Promise<Entity.ApiResponse<Entity.SupabaseSession | null>> {
  const { data, error } = await supabaseClient.auth.refreshSession();
  if (error) return { success: false, data: null, error: error.message };
  if (!data.session) return { success: true, data: null, error: null };
  return { success: true, data: mapSessionFromSupabase(data.session), error: null };
}
