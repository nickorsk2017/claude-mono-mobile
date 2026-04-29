'use client';

import React, { useCallback, useMemo, CSSProperties } from 'react';
import { useAuthentication } from '@common/hooks';
import { softCalmTheme as theme } from '@common/ui-kit/theme';
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

  const pageStyle = useMemo<CSSProperties>(
    () => ({
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.medium,
    }),
    [],
  );

  const cardStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.extraLarge,
      boxShadow: theme.shadows.lifted,
      padding: theme.spacing.extraLarge,
      width: '100%',
      maxWidth: '420px',
      textAlign: 'center',
    }),
    [],
  );

  const greetingStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSizes.extraLarge,
      fontWeight: theme.typography.fontWeights.bold,
      color: theme.colors.textPrimary,
      margin: `${theme.spacing.medium} 0 ${theme.spacing.small}`,
    }),
    [],
  );

  const emailStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSizes.medium,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeights.medium,
      marginBottom: theme.spacing.extraLarge,
    }),
    [],
  );

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <Icon name="check" size={56} color={theme.colors.success} />
        <h1 style={greetingStyle}>Hello, World!</h1>
        <p style={emailStyle}>{currentUser.email}</p>
        {currentUser.displayName && (
          <p
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.fontSizes.body,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.large,
            }}
          >
            {currentUser.displayName}
          </p>
        )}
        <Button
          label="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          isLoading={isAuthenticating}
        />
      </div>
    </div>
  );
});
