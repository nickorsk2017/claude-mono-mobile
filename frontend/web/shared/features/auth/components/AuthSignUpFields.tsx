'use client';

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@common/hooks';
import { signUpWithEmailAndPassword } from '@common/services';
import { Button, TextInput } from '@/shared/ui-kit';
import { signUpValidationSchema } from '@common/schemas/auth.zod';

interface SignUpFormValues {
  displayName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

const initialSignUpFormValues: SignUpFormValues = {
  displayName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
};

export const AuthSignUpFields = React.memo(function AuthSignUpFields({
}: Record<string, never>) {
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: initialSignUpFormValues,
  });
  const signUpServiceClient = useMemo(() => ({ signUp: signUpWithEmailAndPassword }), []);
  const { signUp } = useSignUp(signUpServiceClient);

  const formValues = signUpForm.watch();
  const validationErrors = {
    displayName: signUpForm.formState.errors.displayName?.message,
    emailAddress: signUpForm.formState.errors.emailAddress?.message,
    password: signUpForm.formState.errors.password?.message,
    confirmPassword: signUpForm.formState.errors.confirmPassword?.message,
  };

  const handleFormFieldChange = useCallback(
    (fieldName: keyof SignUpFormValues, value: string) => {
      signUpForm.setValue(fieldName, value, { shouldValidate: true });
      signUpForm.clearErrors(fieldName);
    },
    [signUpForm],
  );

  const handleSignUpSubmit = signUpForm.handleSubmit(async (values) => {
    await signUp(values);
  });

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        label="Display Name"
        value={formValues.displayName}
        onChange={(value: string) => handleFormFieldChange('displayName', value)}
        placeholder="Your name"
        type="text"
        hasError={Boolean(validationErrors.displayName)}
        errorMessage={validationErrors.displayName}
        autoFocus
      />
      <TextInput
        label="Email Address"
        value={formValues.emailAddress}
        onChange={(value: string) => handleFormFieldChange('emailAddress', value)}
        placeholder="you@example.com"
        type="text"
        hasError={Boolean(validationErrors.emailAddress)}
        errorMessage={validationErrors.emailAddress}
      />
      <TextInput
        label="Password"
        value={formValues.password}
        onChange={(value: string) => handleFormFieldChange('password', value)}
        placeholder="Create a password"
        type="password"
        hasError={Boolean(validationErrors.password)}
        errorMessage={validationErrors.password}
      />
      <TextInput
        label="Confirm Password"
        value={formValues.confirmPassword}
        onChange={(value: string) => handleFormFieldChange('confirmPassword', value)}
        placeholder="Re-enter your password"
        type="password"
        hasError={Boolean(validationErrors.confirmPassword)}
        errorMessage={validationErrors.confirmPassword}
      />
      <Button onClick={handleSignUpSubmit}>Create Account</Button>
    </div>
  );
});
