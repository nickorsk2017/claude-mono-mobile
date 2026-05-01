'use client';

import React from 'react';
import { AuthForm } from '@common/ui-kit';

export default function AuthPage() {

  return (
    <div className="md:min-h-screen  h-screen flex items-center justify-center bg-calm-background md:p-4">
      <AuthForm />
    </div>
  );
}
