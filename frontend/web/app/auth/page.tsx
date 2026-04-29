'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticationStore } from '@common/stores/use-authentication-store';
import { AuthForm } from '../../components/AuthForm';
import { softCalmTheme } from '@common/ui-kit/theme';

export default function AuthPage() {
  const router = useRouter();
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser) return null;

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: softCalmTheme.colors.background,
        padding: softCalmTheme.spacing.medium,
      }}
    >
      <AuthForm />
    </main>
  );
}
