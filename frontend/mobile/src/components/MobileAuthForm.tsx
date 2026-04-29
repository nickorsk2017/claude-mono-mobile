import React, { useState, useCallback, useMemo } from 'react';
import { IonCard, IonCardContent } from '@ionic/react';
import { useAuthentication } from '@common/hooks';
import { useSignUp } from '@common/hooks';
import { Button } from '@common/ui-kit/atoms/Button/Button';
import { TextInput } from '@common/ui-kit/molecules/TextInput/TextInput';
import { PasswordInput } from '@common/ui-kit/molecules/PasswordInput/PasswordInput';
import { softCalmTheme as theme } from '@common/ui-kit/theme';
import {
  signInWithEmailAndPassword,
  signOut,
  getActiveSession,
  signUpWithEmailAndPassword,
  signInWithGoogle,
} from '@common/services';
import { validateSignInForm, validateSignUpForm } from '@common/services/validation-service';

type AuthMode = 'sign-in' | 'sign-up';

const initialSignInFormValues: Entity.SignInFormValues = { emailAddress: '', password: '' };
const initialSignUpFormValues: Entity.SignUpFormValues = {
  displayName: '', emailAddress: '', password: '', confirmPassword: '',
};

export const MobileAuthForm = React.memo(function MobileAuthForm() {
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
    <div style={{ padding: theme.spacing.medium }}>
      <div style={{ display: 'flex', marginBottom: theme.spacing.medium }}>
        <button onClick={handleSwitchToSignIn} style={{ flex: 1, padding: theme.spacing.small, background: 'none', border: 'none', fontFamily: theme.typography.fontFamily, color: currentMode === 'sign-in' ? theme.colors.primary : theme.colors.textSecondary, fontWeight: currentMode === 'sign-in' ? theme.typography.fontWeights.semiBold : theme.typography.fontWeights.regular, cursor: 'pointer', borderBottom: `2px solid ${currentMode === 'sign-in' ? theme.colors.primary : theme.colors.border}` }}>Sign In</button>
        <button onClick={handleSwitchToSignUp} style={{ flex: 1, padding: theme.spacing.small, background: 'none', border: 'none', fontFamily: theme.typography.fontFamily, color: currentMode === 'sign-up' ? theme.colors.primary : theme.colors.textSecondary, fontWeight: currentMode === 'sign-up' ? theme.typography.fontWeights.semiBold : theme.typography.fontWeights.regular, cursor: 'pointer', borderBottom: `2px solid ${currentMode === 'sign-up' ? theme.colors.primary : theme.colors.border}` }}>Sign Up</button>
      </div>
      {authenticationError && (
        <div style={{ backgroundColor: theme.colors.errorLight, color: theme.colors.error, borderRadius: theme.borderRadius.medium, padding: theme.spacing.medium, fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.small, marginBottom: theme.spacing.medium }} role="alert">
          {authenticationError}
        </div>
      )}
      {currentMode === 'sign-in' ? (
        <>
          <IonCard><IonCardContent><TextInput value={signInFormValues.emailAddress} onChangeText={handleSignInEmail} label="Email Address" placeholder="you@example.com" inputType="email" autoComplete="email" leadingIconName="mail" errorMessage={validationErrors.emailAddress} isDisabled={isAuthenticating} /></IonCardContent></IonCard>
          <IonCard><IonCardContent><PasswordInput value={signInFormValues.password} onChangeText={handleSignInPassword} label="Password" errorMessage={validationErrors.password} isDisabled={isAuthenticating} /></IonCardContent></IonCard>
        </>
      ) : (
        <>
          <IonCard><IonCardContent><TextInput value={signUpFormValues.displayName} onChangeText={handleSignUpDisplayName} label="Display Name" leadingIconName="user" autoComplete="name" errorMessage={validationErrors.displayName} isDisabled={isAuthenticating} /></IonCardContent></IonCard>
          <IonCard><IonCardContent><TextInput value={signUpFormValues.emailAddress} onChangeText={handleSignUpEmail} label="Email Address" placeholder="you@example.com" inputType="email" autoComplete="email" leadingIconName="mail" errorMessage={validationErrors.emailAddress} isDisabled={isAuthenticating} /></IonCardContent></IonCard>
          <IonCard><IonCardContent><PasswordInput value={signUpFormValues.password} onChangeText={handleSignUpPassword} label="Password" errorMessage={validationErrors.password} isDisabled={isAuthenticating} /></IonCardContent></IonCard>
          <IonCard><IonCardContent><PasswordInput value={signUpFormValues.confirmPassword} onChangeText={handleSignUpConfirmPassword} label="Confirm Password" errorMessage={validationErrors.confirmPassword} isDisabled={isAuthenticating} /></IonCardContent></IonCard>
        </>
      )}
      <div style={{ padding: `${theme.spacing.medium} 0`, display: 'flex', flexDirection: 'column', gap: theme.spacing.medium }}>
        <Button label={currentMode === 'sign-in' ? 'Sign In' : 'Create Account'} onPress={currentMode === 'sign-in' ? handleSignInSubmit : handleSignUpSubmit} isLoading={isAuthenticating} variant="primary" size="large" />
        <Button label="Continue with Google" onPress={handleGoogleSignIn} variant="outline" size="large" />
      </div>
    </div>
  );
});
