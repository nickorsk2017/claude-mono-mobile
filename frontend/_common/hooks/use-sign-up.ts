import { useCallback } from 'react';
import { useAuthenticationStore } from '../stores/use-authentication-store';

interface SignUpServiceClient {
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<Entity.ApiResponse<{ userId: string }>>;
}

interface SignUpHookResult {
  signUp: (formValues: Entity.SignUpFormValues) => Promise<boolean>;
  isAuthenticating: boolean;
  authenticationError: string | null;
  clearAuthenticationError: () => void;
}

export function useSignUp(signUpClient: SignUpServiceClient): SignUpHookResult {
  const {
    isAuthenticating,
    authenticationError,
    setIsAuthenticating,
    setAuthenticationError,
  } = useAuthenticationStore();

  const signUp = useCallback(
    async (formValues: Entity.SignUpFormValues): Promise<boolean> => {
      setIsAuthenticating(true);
      setAuthenticationError(null);

      const response = await signUpClient.signUp(
        formValues.emailAddress,
        formValues.password,
        formValues.displayName,
      );

      setIsAuthenticating(false);

      if (!response.success) {
        setAuthenticationError(response.error ?? 'Sign up failed');
        return false;
      }

      return true;
    },
    [signUpClient, setIsAuthenticating, setAuthenticationError],
  );

  const clearAuthenticationError = useCallback(() => {
    setAuthenticationError(null);
  }, [setAuthenticationError]);

  return { signUp, isAuthenticating, authenticationError, clearAuthenticationError };
}
