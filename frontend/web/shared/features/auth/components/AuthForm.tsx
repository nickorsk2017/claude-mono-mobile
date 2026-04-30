'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AuthSignInFields } from './AuthSignInFields';
import { AuthSignUpFields } from './AuthSignUpFields';
import { Button }  from '@/shared/ui-kit';

type AuthMode = 'sign-in' | 'sign-up';

export const AuthForm = React.memo(function AuthForm() {
  const [currentMode, setCurrentMode] = useState<AuthMode>('sign-in');
  const isSignInMode = currentMode === 'sign-in';

  const handleSwitchMode = useCallback((nextMode: AuthMode) => {
    setCurrentMode(nextMode);
  }, []);

  const switchButtonsJSX = useMemo(() => {
    return (
    <div className="flex items-center gap-2 flex-none mt-2">
      <Button disabled={isSignInMode}  variant="ghost" className={`!w-auto ${isSignInMode ? 'underline' : ''}`}  onClick={() => handleSwitchMode('sign-in')}>
        Sign In
      </Button> <span className="text-calm-muted">|</span>
      <Button disabled={!isSignInMode}  variant="ghost" className={`!w-auto ${!isSignInMode ? 'underline' : ''}`} onClick={() => handleSwitchMode('sign-up')}>
        Sign Up
      </Button>
    </div>
    );
  }, [currentMode]);

  return (
    <div className="relative flex flex-col bg-calm-surface rounded-lg w-full max-w-[640px] overflow-hidden h-screen md:h-auto">
      <div className="px-10 pt-10 pb-4 border-b border-calm-border">
        <h1 className="text-heading font-bold text-calm-text tracking-wide w-full leading-none ">{currentMode === 'sign-in' ? 'SIGN IN' : 'SIGN UP'}</h1>
        <div className="flex flex-col items-center md:justify-between mt-5 md:flex-row">
          <span className="w-full text-label text-calm-label">
            {currentMode === 'sign-in' ? 'Sign in to your account' : 'Create a new account'}
          </span>

          {switchButtonsJSX}
        </div>
        
      </div>
      <div className="px-10 py-8">
        {currentMode === 'sign-in' ? (
          <AuthSignInFields />
        ) : (
          <AuthSignUpFields />
        )}
      </div>
    </div>
  );
});
