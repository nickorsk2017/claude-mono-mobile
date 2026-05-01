import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { AuthForm } from '@common/ui-kit';

export function AuthPage(): React.JSX.Element {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <AuthForm />
      </IonContent>
    </IonPage>
  );
}
