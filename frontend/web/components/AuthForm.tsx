'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAuthentication } from '@common/hooks';
import { useSignUp } from '@common/hooks';
import { Button } from '@common/ui-kit/atoms/Button/Button';
import { Icon } from '@common/ui-kit/atoms/Icon/Icon';
import {
  signInWithEmailAndPassword,
  signOut,
  getActiveSession,
  signUpWithEmailAndPassword,
  signInWithGoogle,
} from '@common/services';
import { validateSignInForm, validateSignUpForm } from '@common/services/validation-service';
import { AuthSignInFields } from './AuthSignInFields';
import { AuthSignUpFields } from './AuthSignUpFields';

type AuthMode = 'sign-in' | 'sign-up';

const initialSignInFormValues: Entity.SignInFormValues = { emailAddress: '', password: '' };
const initialSignUpFormValues: Entity.SignUpFormValues = {
  displayName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
};

function resolveTabClassName(isActive: boolean): string {
  const baseClasses = 'flex-1 py-2 bg-transparent border-none border-b-2 cursor-pointer text-body transition-all outline-none';
  return isActive
    ? `${baseClasses} font-semibold text-calm-primary border-calm-primary`
    : `${baseClasses} font-normal text-calm-muted border-calm-border`;
}

export const AuthForm = React.memo(function AuthForm() {
  const [currentMode, setCurrentMode] = useState<AuthMode>('sign-in');
  const [signInFormValues, setSignInFormValues] = useState(initialSignInFormValues);
  const [signUpFormValues, setSignUpFormValues] = useState(initialSignUpFormValues);
  const [validationErrors, setValidationErrors] = useState<Entity.AuthValidationErrors>({});

  const authenticationClient = useMemo(
    () => ({ signIn: signInWithEmailAndPassword, signOut, getSession: getActiveSession }),
    [],
  );
  const signUpServiceClient = useMemo(() => ({ signUp: signUpWithEmailAndPassword }), []);

  const { login, isAuthenticating, authenticationError, clearAuthenticationError } =
    useAuthentication(authenticationClient);
  const { signUp } = useSignUp(signUpServiceClient);

  const handleSignInEmail = useCallback((value: string) => {
    setSignInFormValues((previousValues) => ({ ...previousValues, emailAddress: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, emailAddress: undefined }));
  }, []);
  const handleSignInPassword = useCallback((value: string) => {
    setSignInFormValues((previousValues) => ({ ...previousValues, password: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, password: undefined }));
  }, []);
  const handleSignUpDisplayName = useCallback((value: string) => {
    setSignUpFormValues((previousValues) => ({ ...previousValues, displayName: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, displayName: undefined }));
  }, []);
  const handleSignUpEmail = useCallback((value: string) => {
    setSignUpFormValues((previousValues) => ({ ...previousValues, emailAddress: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, emailAddress: undefined }));
  }, []);
  const handleSignUpPassword = useCallback((value: string) => {
    setSignUpFormValues((previousValues) => ({ ...previousValues, password: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, password: undefined }));
  }, []);
  const handleSignUpConfirmPassword = useCallback((value: string) => {
    setSignUpFormValues((previousValues) => ({ ...previousValues, confirmPassword: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, confirmPassword: undefined }));
  }, []);

  const handleSignInSubmit = useCallback(async () => {
    const errors = validateSignInForm(signInFormValues);
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
    await login({ email: signInFormValues.emailAddress, password: signInFormValues.password });
  }, [signInFormValues, login]);

  const handleSignUpSubmit = useCallback(async () => {
    const errors = validateSignUpForm(signUpFormValues);
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
    await signUp(signUpFormValues);
  }, [signUpFormValues, signUp]);

  const handleGoogleSignIn = useCallback(() => signInWithGoogle(), []);

  const handleSwitchToSignIn = useCallback(() => {
    setCurrentMode('sign-in'); setValidationErrors({}); clearAuthenticationError();
  }, [clearAuthenticationError]);
  const handleSwitchToSignUp = useCallback(() => {
    setCurrentMode('sign-up'); setValidationErrors({}); clearAuthenticationError();
  }, [clearAuthenticationError]);

  return (
    <div className="bg-calm-surface rounded-3xl shadow-lifted w-full max-w-[420px] p-8">
      <div className="text-center mb-6">
        <Icon name="user" size={48} color="#7C9CF5" />
        <h1 className="text-2xl font-bold text-calm-text mt-2 mb-1">Welcome</h1>
        <p className="text-body text-calm-muted">
          {currentMode === 'sign-in' ? 'Sign in to your account' : 'Create a new account'}
        </p>
      </div>

      <div className="flex mb-6">
        <button className={resolveTabClassName(currentMode === 'sign-in')} onClick={handleSwitchToSignIn}>
          Sign In
        </button>
        <button className={resolveTabClassName(currentMode === 'sign-up')} onClick={handleSwitchToSignUp}>
          Sign Up
        </button>
      </div>

      {authenticationError && (
        <div className="bg-calm-error-light text-calm-error rounded-xl p-4 text-caption mb-4" role="alert">
          {authenticationError}
        </div>
      )}

      {currentMode === 'sign-in' ? (
        <AuthSignInFields
          emailAddress={signInFormValues.emailAddress}
          password={signInFormValues.password}
          validationErrors={validationErrors}
          isDisabled={isAuthenticating}
          onEmailChange={handleSignInEmail}
          onPasswordChange={handleSignInPassword}
        />
      ) : (
        <AuthSignUpFields
          formValues={signUpFormValues}
          validationErrors={validationErrors}
          isDisabled={isAuthenticating}
          onDisplayNameChange={handleSignUpDisplayName}
          onEmailChange={handleSignUpEmail}
          onPasswordChange={handleSignUpPassword}
          onConfirmPasswordChange={handleSignUpConfirmPassword}
        />
      )}

      <div className="mt-6">
        <Button
          label={currentMode === 'sign-in' ? 'Sign In' : 'Create Account'}
          onPress={currentMode === 'sign-in' ? handleSignInSubmit : handleSignUpSubmit}
          isLoading={isAuthenticating}
          variant="primary"
          size="large"
        />
      </div>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-calm-border" />
        <span className="text-caption text-calm-muted">or</span>
        <div className="flex-1 h-px bg-calm-border" />
      </div>

      <Button label="Continue with Google" onPress={handleGoogleSignIn} variant="outline" size="large" />
    </div>
  );
});
