'use client';

import React from 'react';
import { TextInput } from '@common/ui-kit/molecules/TextInput/TextInput';
import { PasswordInput } from '@common/ui-kit/molecules/PasswordInput/PasswordInput';
import { softCalmTheme } from '@common/ui-kit/theme';

interface AuthSignUpFieldsProps {
  formValues: Entity.SignUpFormValues;
  validationErrors: Entity.AuthValidationErrors;
  isDisabled: boolean;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export const AuthSignUpFields = React.memo(function AuthSignUpFields({
  formValues,
  validationErrors,
  isDisabled,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: AuthSignUpFieldsProps) {
  return (
    <>
      <TextInput
        value={formValues.displayName}
        onChangeText={onDisplayNameChange}
        label="Display Name"
        placeholder="Your name"
        autoComplete="name"
        leadingIconName="user"
        errorMessage={validationErrors.displayName}
        isDisabled={isDisabled}
      />
      <div style={{ height: softCalmTheme.spacing.small }} />
      <TextInput
        value={formValues.emailAddress}
        onChangeText={onEmailChange}
        label="Email Address"
        placeholder="you@example.com"
        inputType="email"
        autoComplete="email"
        leadingIconName="mail"
        errorMessage={validationErrors.emailAddress}
        isDisabled={isDisabled}
      />
      <div style={{ height: softCalmTheme.spacing.small }} />
      <PasswordInput
        value={formValues.password}
        onChangeText={onPasswordChange}
        label="Password"
        placeholder="Create a password"
        errorMessage={validationErrors.password}
        isDisabled={isDisabled}
      />
      <div style={{ height: softCalmTheme.spacing.small }} />
      <PasswordInput
        value={formValues.confirmPassword}
        onChangeText={onConfirmPasswordChange}
        label="Confirm Password"
        placeholder="Re-enter your password"
        errorMessage={validationErrors.confirmPassword}
        isDisabled={isDisabled}
      />
    </>
  );
});
