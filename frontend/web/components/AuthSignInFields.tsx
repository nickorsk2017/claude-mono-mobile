'use client';

import React from 'react';
import { TextInput } from '@common/ui-kit/molecules/TextInput/TextInput';
import { PasswordInput } from '@common/ui-kit/molecules/PasswordInput/PasswordInput';

interface AuthSignInFieldsProps {
  emailAddress: string;
  password: string;
  validationErrors: Entity.AuthValidationErrors;
  isDisabled: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const AuthSignInFields = React.memo(function AuthSignInFields({
  emailAddress,
  password,
  validationErrors,
  isDisabled,
  onEmailChange,
  onPasswordChange,
}: AuthSignInFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <TextInput
        value={emailAddress}
        onChangeText={onEmailChange}
        label="Email Address"
        placeholder="you@example.com"
        inputType="email"
        autoComplete="email"
        leadingIconName="mail"
        errorMessage={validationErrors.emailAddress}
        isDisabled={isDisabled}
      />
      <PasswordInput
        value={password}
        onChangeText={onPasswordChange}
        label="Password"
        placeholder="Enter your password"
        errorMessage={validationErrors.password}
        isDisabled={isDisabled}
      />
    </div>
  );
});
