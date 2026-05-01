import { requestBackend } from '@common/utils';

type BackendAuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: Pick<Entity.User, 'id' | 'email' | 'displayName' | 'createdAt'>;
};
type AuthenticationPayload = { user: Entity.User; session: Omit<BackendAuthenticationResponse, 'user'> };
const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';
const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

let activeAccessToken: string | null = null;
let activeRefreshToken: string | null = null;

function resolveAccessTokenMaxAge(expiresAt: number | undefined): number {
  if (!expiresAt) return 3600;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiresAtInSeconds = expiresAt > 10_000_000_000 ? Math.floor(expiresAt / 1000) : expiresAt;
  const computedMaxAge = expiresAtInSeconds - nowInSeconds;

  return computedMaxAge > 0 ? computedMaxAge : 1;
}

function setActiveAccessToken(nextToken: string | null, expiresAt?: number): void {
  activeAccessToken = nextToken;
  if (typeof document === 'undefined') return;
  if (nextToken) {
    const accessTokenMaxAge = resolveAccessTokenMaxAge(expiresAt);
    document.cookie = `${ACCESS_TOKEN_COOKIE_KEY}=${encodeURIComponent(nextToken)}; path=/; max-age=${accessTokenMaxAge}; SameSite=Strict`;
  } else {
    document.cookie = `${ACCESS_TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Strict`;
  }
}

function getActiveAccessToken(): string | null {
  if (activeAccessToken) return activeAccessToken;
  if (typeof document === 'undefined') return null;
  const cookieMatch = document.cookie.match(new RegExp(`(?:^|;\\s*)${ACCESS_TOKEN_COOKIE_KEY}=([^;]*)`));
  if (!cookieMatch) return null;
  activeAccessToken = decodeURIComponent(cookieMatch[1]);
  return activeAccessToken;
}

function setActiveRefreshToken(nextToken: string | null): void {
  activeRefreshToken = nextToken;
  if (typeof document === 'undefined') return;
  if (nextToken) {
    const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
    document.cookie = `${REFRESH_TOKEN_COOKIE_KEY}=${encodeURIComponent(nextToken)}; path=/; max-age=${thirtyDaysInSeconds}; SameSite=Strict`;
  } else {
    document.cookie = `${REFRESH_TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Strict`;
  }
}

function getActiveRefreshToken(): string | null {
  if (activeRefreshToken) return activeRefreshToken;
  if (typeof document === 'undefined') return null;
  const cookieMatch = document.cookie.match(new RegExp(`(?:^|;\\s*)${REFRESH_TOKEN_COOKIE_KEY}=([^;]*)`));
  if (!cookieMatch) return null;
  activeRefreshToken = decodeURIComponent(cookieMatch[1]);
  return activeRefreshToken;
}

function mapBackendUser(backendUser: BackendAuthenticationResponse['user']): Entity.User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    displayName: backendUser.displayName,
    avatarUrl: null,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.createdAt,
  };
}

function createErrorResponse<DataType>(message: string): Entity.ApiResponse<DataType> {
  return { success: false, data: null as DataType, error: message };
}

export async function signInWithEmailAndPassword(
  emailAddress: string,
  password: string,
): Promise<Entity.ApiResponse<AuthenticationPayload>> {
  try {
    const signInResponse = await requestBackend<BackendAuthenticationResponse>('/auth/sign-in', {
      method: 'POST',
      body: { email: emailAddress, password },
    });
    if (!signInResponse.success || !signInResponse.data) {
      return createErrorResponse(signInResponse.error ?? 'Email/password login failed.');
    }

    setActiveAccessToken(signInResponse.data.accessToken, signInResponse.data.expiresAt);
    setActiveRefreshToken(signInResponse.data.refreshToken);
    const { user: backendUser, ...session } = signInResponse.data;

    return {
      success: true,
      data: { user: mapBackendUser(backendUser), session },
      error: null,
    };
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Email/password login failed.');
  }
}

export async function signUpWithEmailAndPassword(
  emailAddress: string,
  password: string,
  displayName: string,
): Promise<Entity.ApiResponse<{ userId: string }>> {
  return requestBackend<{ userId: string }>('/auth/sign-up', {
    method: 'POST',
    body: { email: emailAddress, password, displayName },
  });
}

export async function signOut(): Promise<Entity.ApiResponse<null>> {
  const accessToken = getActiveAccessToken();
  const signOutResponse = await requestBackend<null>('/auth/sign-out', {
    method: 'POST',
    credentials: 'include',
    ...(accessToken ? { accessToken } : {}),
  });
  setActiveAccessToken(null);
  setActiveRefreshToken(null);
  if (!signOutResponse.success) return { success: false, data: null, error: signOutResponse.error };
  return { success: true, data: null, error: null };
}

export async function getActiveSession(): Promise<Entity.ApiResponse<AuthenticationPayload | null>> {
  const refreshResponse = await requestBackend<BackendAuthenticationResponse>('/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshResponse.success || !refreshResponse.data) {
    return { success: true, data: null, error: null };
  }

  setActiveAccessToken(refreshResponse.data.accessToken, refreshResponse.data.expiresAt);
  setActiveRefreshToken(refreshResponse.data.refreshToken);
  const { user: backendUser, ...session } = refreshResponse.data;
  return {
    success: true,
    data: {
      user: mapBackendUser(backendUser),
      session: {
        ...session,
        refreshToken: getActiveRefreshToken() ?? session.refreshToken,
      },
    },
    error: null,
  };
}
