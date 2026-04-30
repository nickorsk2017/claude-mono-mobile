import { useCallback } from 'react';
import { useAuthenticationStore } from '@common/stores/useAuthStore';

interface SignUpServiceClient {
  signUp: (
    emailAddress: string,
    password: string,
    displayName: string,
  ) => Promise<{ success: boolean; data: unknown; error: string | null }>;
}

interface SignUpFormValues {
  emailAddress: string;
  password: string;
  displayName: string;
}

export function useSignUp(signUpServiceClient: SignUpServiceClient) {
  const setCurrentUser = useAuthenticationStore((state) => state.setCurrentUser);

  const signUp = useCallback(
    async (formValues: SignUpFormValues) => {
      const signUpResponse = await signUpServiceClient.signUp(
        formValues.emailAddress,
        formValues.password,
        formValues.displayName,
      );
      if (!signUpResponse.success) {
        return signUpResponse;
      }

      const responseData = signUpResponse.data as { user?: Entity.User } | null;
      setCurrentUser(responseData?.user ?? null);
      return signUpResponse;
    },
    [signUpServiceClient, setCurrentUser],
  );

  return { signUp };
}
