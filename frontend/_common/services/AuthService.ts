type BackendAuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: Pick<Entity.User, 'id' | 'email' | 'displayName' | 'createdAt'>;
};
type AuthenticationPayload = { user: Entity.User; session: Omit<BackendAuthenticationResponse, 'user'> };

let activeAccessToken: string | null = null;

function resolveBackendUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.EXPO_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    'http://localhost:4000'
  );
}

function getTokenStorage(): Storage | null {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) return null;
  return globalThis.localStorage;
}

function setActiveAccessToken(nextToken: string | null): void {
  activeAccessToken = nextToken;
  if (typeof document !== 'undefined') {
    if (nextToken) {
      document.cookie = `accessToken=${encodeURIComponent(nextToken)}; path=/; max-age=3600; SameSite=Strict`;
    } else {
      document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Strict';
    }
  }
  const tokenStorage = getTokenStorage();
  if (!tokenStorage) return;
  if (nextToken) tokenStorage.setItem('accessToken', nextToken);
  else tokenStorage.removeItem('accessToken');
}

function getActiveAccessToken(): string | null {
  if (activeAccessToken) return activeAccessToken;
  if (typeof document !== 'undefined') {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
    if (cookieMatch) {
      activeAccessToken = decodeURIComponent(cookieMatch[1]);
      return activeAccessToken;
    }
  }
  const tokenStorage = getTokenStorage();
  const storedToken = tokenStorage?.getItem('accessToken') ?? null;
  activeAccessToken = storedToken;
  return storedToken;
}

function setActiveRefreshToken(nextToken: string | null): void {
  if (typeof document === 'undefined') return;
  if (nextToken) {
    const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
    document.cookie = `refreshToken=${encodeURIComponent(nextToken)}; path=/; max-age=${thirtyDaysInSeconds}; SameSite=Strict`;
  } else {
    document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Strict';
  }
}

function getActiveRefreshToken(): string | null {
  if (typeof document === 'undefined') return null;
  const cookieMatch = document.cookie.match(/(?:^|;\s*)refreshToken=([^;]*)/);
  return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
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

async function requestBackend<DataType>(
  pathname: string,
  options: { method: string; body?: unknown; accessToken?: string },
): Promise<Entity.ApiResponse<DataType>> {
  const backendUrl = resolveBackendUrl();
  console.log(backendUrl, 'backendUrl!')
  if (!backendUrl) return createErrorResponse<DataType>('Missing backend configuration.');

  try {
    const response = await fetch(`${backendUrl}${pathname}`, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    const parsedResponse = (await response.json()) as Entity.ApiResponse<DataType>;
    if (!response.ok || !parsedResponse.success) {
      return createErrorResponse(parsedResponse.error ?? `Request failed (${response.status}).`);
    }

    return parsedResponse;
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Request failed.');
  }
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

    setActiveAccessToken(signInResponse.data.accessToken);
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
): Promise<Entity.ApiResponse<AuthenticationPayload>> {
  const signUpResponse = await requestBackend<{ userId: string }>('/auth/sign-up', {
    method: 'POST',
    body: { email: emailAddress, password, displayName },
  });
  if (!signUpResponse.success) return createErrorResponse(signUpResponse.error ?? 'Sign-up failed.');
  return signInWithEmailAndPassword(emailAddress, password);
}

export async function signOut(): Promise<Entity.ApiResponse<null>> {
  const accessToken = getActiveAccessToken();
  if (!accessToken) return { success: true, data: null, error: null };
  const signOutResponse = await requestBackend<null>('/auth/sign-out', {
    method: 'POST',
    accessToken,
  });
  if (!signOutResponse.success) return { success: false, data: null, error: signOutResponse.error };
  setActiveAccessToken(null);
  setActiveRefreshToken(null);
  return { success: true, data: null, error: null };
}

export async function getActiveSession(): Promise<Entity.ApiResponse<AuthenticationPayload | null>> {
  const accessToken = getActiveAccessToken();
  if (!accessToken) return { success: true, data: null, error: null };

  const response = await requestBackend<BackendAuthenticationResponse['user']>('/auth/session', {
    method: 'GET',
    accessToken,
  });

  if (!response.success || !response.data) return { success: true, data: null, error: null };

  return {
    success: true,
    data: {
      user: mapBackendUser(response.data),
      session: { accessToken, refreshToken: getActiveRefreshToken() ?? '', expiresAt: 0 },
    },
    error: null,
  };
}

export async function signInWithGoogle(): Promise<Entity.ApiResponse<{ redirectToUrl: string | null }>> {
  return createErrorResponse('Google sign-in is not implemented through backend yet.');
}
