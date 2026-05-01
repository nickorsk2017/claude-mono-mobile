import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { DashboardOrganism } from '@common/ui-kit';

export function DashboardPage(): JSX.Element {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
        <DashboardOrganism onSignedOut={() => history.replace('/auth')} />
      </IonContent>
    </IonPage>
  );
}
