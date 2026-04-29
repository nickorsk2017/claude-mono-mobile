import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuthenticationStore } from '@common/stores/use-authentication-store';
import { MobileAuthForm } from '../components/MobileAuthForm';
import { softCalmTheme as theme } from '@common/ui-kit/theme';

export const AuthPage = React.memo(function AuthPage() {
  const history = useHistory();
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      history.replace('/dashboard');
    }
  }, [currentUser, history]);

  if (currentUser) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            '--background': theme.colors.surface,
            '--color': theme.colors.textPrimary,
          }}
        >
          <IonTitle
            style={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.fontWeights.semiBold,
            }}
          >
            Welcome
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        style={{ '--background': theme.colors.background }}
        fullscreen
      >
        <MobileAuthForm />
      </IonContent>
    </IonPage>
  );
});
