import { useCallback, useState } from 'react';
import { useAuthenticationStore } from '@common/stores/useAuthStore';

interface AuthenticationClient {
  signIn: (email: string, password: string) => Promise<{ success: boolean; data: unknown; error: string | null }>;
  signOut: () => Promise<{ success: boolean; data: unknown; error: string | null }>;
}

export function useAuthentication(authenticationClient: AuthenticationClient) {
  const setCurrentUser = useAuthenticationStore((state) => state.setCurrentUser);
  const clearCurrentUser = useAuthenticationStore((state) => state.clearCurrentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationError, setAuthenticationError] = useState<string | null>(null);

  const clearAuthenticationError = useCallback(() => {
    setAuthenticationError(null);
  }, []);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsAuthenticating(true);
      setAuthenticationError(null);
      const authenticationResponse = await authenticationClient.signIn(email, password);
      if (!authenticationResponse.success) {
        setAuthenticationError(authenticationResponse.error ?? 'Unable to sign in.');
        setIsAuthenticating(false);
        return;
      }

      const responseData = authenticationResponse.data as { user?: Entity.User } | null;
      setCurrentUser(responseData?.user ?? null);
      setIsAuthenticating(false);
    },
    [authenticationClient, setCurrentUser],
  );

  const logout = useCallback(async (): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthenticationError(null);
    const authenticationResponse = await authenticationClient.signOut();
    if (!authenticationResponse.success) {
      setAuthenticationError(authenticationResponse.error ?? 'Unable to sign out.');
      setIsAuthenticating(false);
      return false;
    }
    clearCurrentUser();
    setIsAuthenticating(false);
    return true;
  }, [authenticationClient, clearCurrentUser]);

  return {
    login,
    logout,
    isAuthenticating,
    authenticationError,
    clearAuthenticationError,
  };
}
