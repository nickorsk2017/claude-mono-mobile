'use client';

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthentication } from '@common/hooks';
import { signInWithEmailAndPassword, signOut } from '@common/services';
import { Button, TextInput } from '@/shared/ui-kit';
import { signInValidationSchema } from '@common/schemas/auth.zod';

interface SignInFormValues {
  emailAddress: string;
  password: string;
}

const initialSignInFormValues: SignInFormValues = {
  emailAddress: '',
  password: '',
};

export const AuthSignInFields = React.memo(function AuthSignInFields({
}: Record<string, never>) {
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: initialSignInFormValues,
  });

  const authenticationClient = useMemo(
    () => ({ signIn: signInWithEmailAndPassword, signOut }),
    [],
  );
  const { login, isAuthenticating, authenticationError } = useAuthentication(authenticationClient);

  const signInFormValues = signInForm.watch();
  const validationErrors = {
    emailAddress: signInForm.formState.errors.emailAddress?.message,
    password: signInForm.formState.errors.password?.message,
  };

  const handleFormFieldChange = useCallback(
    (fieldName: keyof SignInFormValues, value: string) => {
      signInForm.setValue(fieldName, value, { shouldValidate: true });
      signInForm.clearErrors(fieldName);
    },
    [signInForm],
  );

  const handleSignInSubmit = signInForm.handleSubmit(async (values) => {
    await login({ email: values.emailAddress, password: values.password });
  });

  return (
    <div className="flex flex-col gap-4">
      {authenticationError ? (
        <div className="bg-calm-error-light text-calm-error rounded-xl p-4 text-caption" role="alert">
          {authenticationError}
        </div>
      ) : null}
      <TextInput
        label="Your E-mail"
        value={signInFormValues.emailAddress}
        onChange={(value: string) => handleFormFieldChange('emailAddress', value)}
        placeholder="Your e-mail"
        type="text"
        hasError={Boolean(validationErrors.emailAddress)}
        errorMessage={validationErrors.emailAddress}
        autoFocus
      />
      <TextInput
        label="Password"
        value={signInFormValues.password}
        onChange={(value: string) => handleFormFieldChange('password', value)}
        placeholder="Password"
        type="password"
        hasError={Boolean(validationErrors.password)}
        errorMessage={validationErrors.password}
      />

      <div className="flex flex-col items-center w-full gap-2 md:static absolute bottom-0 left-0 px-10 py-8 md:px-0">
        <Button onClick={handleSignInSubmit} disabled={isAuthenticating}>
          {isAuthenticating ? 'Loading...' : 'Login'}
        </Button>
        <Button variant="ghost" size="small" onClick={() => undefined}>
          Forgot password?
        </Button>
      </div>
    </div>
  );
});
