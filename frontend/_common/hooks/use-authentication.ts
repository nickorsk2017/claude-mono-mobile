import { useCallback, useEffect } from 'react';
import { useAuthenticationStore } from '../stores/use-authentication-store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthenticationHookResult {
  currentUser: Entity.User | null;
  isAuthenticating: boolean;
  authenticationError: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthenticationError: () => void;
}

export function useAuthentication(
  authClient: {
    signIn: (email: string, password: string) => Promise<Entity.ApiResponse<{ user: Entity.User; session: Entity.SupabaseSession }>>;
    signOut: () => Promise<Entity.ApiResponse<null>>;
    getSession: () => Promise<Entity.ApiResponse<Entity.SupabaseSession | null>>;
  }
): AuthenticationHookResult {
  const {
    currentUser,
    isAuthenticating,
    authenticationError,
    setCurrentUser,
    setActiveSession,
    setIsAuthenticating,
    setAuthenticationError,
    clearAuthentication,
  } = useAuthenticationStore();

  useEffect(() => {
    async function restoreSession() {
      const response = await authClient.getSession();
      if (!response.success || !response.data) return;
      setActiveSession(response.data);
    }
    restoreSession();
  }, [authClient, setActiveSession]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsAuthenticating(true);
      setAuthenticationError(null);
      const response = await authClient.signIn(credentials.email, credentials.password);
      if (response.success && response.data) {
        setCurrentUser(response.data.user);
        setActiveSession(response.data.session);
      } else {
        setAuthenticationError(response.error ?? 'Login failed');
      }
      setIsAuthenticating(false);
    },
    [authClient, setIsAuthenticating, setAuthenticationError, setCurrentUser, setActiveSession]
  );

  const logout = useCallback(async () => {
    setIsAuthenticating(true);
    await authClient.signOut();
    clearAuthentication();
  }, [authClient, setIsAuthenticating, clearAuthentication]);

  const clearAuthenticationError = useCallback(() => {
    setAuthenticationError(null);
  }, [setAuthenticationError]);

  return {
    currentUser,
    isAuthenticating,
    authenticationError,
    isAuthenticated: currentUser !== null,
    login,
    logout,
    clearAuthenticationError,
  };
}
