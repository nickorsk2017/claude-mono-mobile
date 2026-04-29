'use client';

import React, { useCallback, useMemo } from 'react';
import { useAuthentication } from '@common/hooks';
import { Button } from '@common/ui-kit/atoms/Button/Button';
import { Icon } from '@common/ui-kit/atoms/Icon/Icon';
import { signOut, getActiveSession } from '@common/services';

interface DashboardViewProps {
  currentUser: Entity.User;
}

export const DashboardView = React.memo(function DashboardView({
  currentUser,
}: DashboardViewProps) {
  const authenticationClient = useMemo(
    () => ({
      signIn: async () => ({ success: false, data: null as never, error: 'Not used' }),
      signOut,
      getSession: getActiveSession,
    }),
    [],
  );

  const { logout, isAuthenticating } = useAuthentication(authenticationClient);

  const handleSignOut = useCallback(() => logout(), [logout]);

  return (
    <div className="min-h-screen bg-calm-background flex items-center justify-center p-4">
      <div className="bg-calm-surface rounded-3xl shadow-lifted w-full max-w-[420px] p-8 text-center">
        <Icon name="check" size={56} color="#6EE7B7" />

        <h1 className="text-3xl font-bold text-calm-text mt-4 mb-2">
          Hello, World!
        </h1>

        <p className="text-medium font-medium text-calm-primary mb-2">
          {currentUser.email}
        </p>

        {currentUser.displayName && (
          <p className="text-body text-calm-muted mb-6">
            {currentUser.displayName}
          </p>
        )}

        <div className="mt-6">
          <Button
            label="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            isLoading={isAuthenticating}
          />
        </div>
      </div>
    </div>
  );
});
