import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { lockClosedOutline, homeOutline } from 'ionicons/icons';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

setupIonicReact();

export function App(): JSX.Element {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route exact path="/" render={() => <Redirect to="/auth" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="auth" href="/auth">
              <IonIcon icon={lockClosedOutline} />
              <IonLabel>Auth</IonLabel>
            </IonTabButton>
            <IonTabButton tab="dashboard" href="/dashboard">
              <IonIcon icon={homeOutline} />
              <IonLabel>Dashboard</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
