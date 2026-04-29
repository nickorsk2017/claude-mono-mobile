import React, { useCallback, useEffect, useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuthentication } from '@common/hooks';
import { useAuthenticationStore } from '@common/stores/use-authentication-store';
import { Button } from '@common/ui-kit/atoms/Button/Button';
import { Icon } from '@common/ui-kit/atoms/Icon/Icon';
import { softCalmTheme as theme } from '@common/ui-kit/theme';
import { signOut, getActiveSession } from '@common/services';

export const DashboardPage = React.memo(function DashboardPage() {
  const history = useHistory();
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  const authenticationClient = useMemo(
    () => ({
      signIn: async () => ({ success: false, data: null as never, error: 'Not used' }),
      signOut,
      getSession: getActiveSession,
    }),
    [],
  );

  const { logout, isAuthenticating } = useAuthentication(authenticationClient);

  useEffect(() => {
    if (!currentUser) {
      history.replace('/auth');
    }
  }, [currentUser, history]);

  const handleSignOut = useCallback(() => logout(), [logout]);

  if (!currentUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': theme.colors.surface, '--color': theme.colors.textPrimary }}>
          <IonTitle style={{ fontFamily: theme.typography.fontFamily }}>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': theme.colors.background }} fullscreen>
        <div style={{ padding: theme.spacing.medium, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: theme.spacing.extraLarge }}>
          <Icon name="check" size={64} color={theme.colors.success} />
          <h1 style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.large, fontWeight: theme.typography.fontWeights.bold, color: theme.colors.textPrimary, margin: `${theme.spacing.medium} 0 ${theme.spacing.small}`, textAlign: 'center' }}>
            Hello, World!
          </h1>
          <IonCard style={{ width: '100%', maxWidth: '420px' }}>
            <IonCardContent>
              <p style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.medium, color: theme.colors.primary, fontWeight: theme.typography.fontWeights.medium, margin: `0 0 ${theme.spacing.small}`, textAlign: 'center' }}>
                {currentUser.email}
              </p>
              {currentUser.displayName && (
                <p style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.fontSizes.body, color: theme.colors.textSecondary, margin: 0, textAlign: 'center' }}>
                  {currentUser.displayName}
                </p>
              )}
            </IonCardContent>
          </IonCard>
          <div style={{ width: '100%', maxWidth: '420px', marginTop: theme.spacing.large }}>
            <Button label="Sign Out" onPress={handleSignOut} variant="outline" isLoading={isAuthenticating} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
});
