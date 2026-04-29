'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticationStore } from '@common/stores/use-authentication-store';
import { DashboardView } from '../../components/DashboardView';

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  useEffect(() => {
    if (!currentUser) {
      router.replace('/auth');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <DashboardView currentUser={currentUser} />;
}
