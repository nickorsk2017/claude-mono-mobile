'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticationStore } from '@common/stores/use-authentication-store';
import { AuthForm } from '../../components/AuthForm';

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
    <main className="min-h-screen flex items-center justify-center bg-calm-background p-4">
      <AuthForm />
    </main>
  );
}
