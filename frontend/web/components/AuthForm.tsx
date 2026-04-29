'use client';

import React, { useState, useCallback, useMemo, CSSProperties } from 'react';
import { useAuthentication } from '@common/hooks';
import { useSignUp } from '@common/hooks';
import { softCalmTheme as theme } from '@common/ui-kit/theme';
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

  const cardStyle = useMemo<CSSProperties>(() => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.extraLarge,
    boxShadow: theme.shadows.lifted,
    padding: theme.spacing.extraLarge,
    width: '100%',
    maxWidth: '420px',
  }), []);

  const tabActiveStyle = (isActive: boolean): CSSProperties => ({
    flex: 1, padding: `${theme.spacing.small} 0`,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSizes.body,
    fontWeight: isActive ? theme.typography.fontWeights.semiBold : theme.typography.fontWeights.regular,
    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
    background: 'none', border: 'none',
    borderBottom: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    cursor: 'pointer', transition: theme.transitions.normal,
  });

  return (
    <div style={cardStyle}>
      <div style={{ textAlign: 'center', marginBottom: theme.spacing.large }}>
        <Icon name="user" size={48} color={theme.colors.primary} />
        <h1 style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.large, fontWeight: theme.typography.fontWeights.bold, color: theme.colors.textPrimary, margin: `${theme.spacing.small} 0 ${theme.spacing.extraSmall}` }}>
          Welcome
        </h1>
        <p style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.body, color: theme.colors.textSecondary, margin: 0 }}>
          {currentMode === 'sign-in' ? 'Sign in to your account' : 'Create a new account'}
        </p>
      </div>
      <div style={{ display: 'flex', marginBottom: theme.spacing.large }}>
        <button style={tabActiveStyle(currentMode === 'sign-in')} onClick={handleSwitchToSignIn}>Sign In</button>
        <button style={tabActiveStyle(currentMode === 'sign-up')} onClick={handleSwitchToSignUp}>Sign Up</button>
      </div>
      {authenticationError && (
        <div style={{ backgroundColor: theme.colors.errorLight, color: theme.colors.error, borderRadius: theme.borderRadius.medium, padding: theme.spacing.medium, fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.small, marginBottom: theme.spacing.medium }} role="alert">
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
      <div style={{ height: theme.spacing.large }} />
      <Button
        label={currentMode === 'sign-in' ? 'Sign In' : 'Create Account'}
        onPress={currentMode === 'sign-in' ? handleSignInSubmit : handleSignUpSubmit}
        isLoading={isAuthenticating}
        variant="primary"
        size="large"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.medium, margin: `${theme.spacing.large} 0` }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
        <span style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.small, color: theme.colors.textSecondary }}>or</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
      </div>
      <Button label="Continue with Google" onPress={handleGoogleSignIn} variant="outline" size="large" />
    </div>
  );
});
