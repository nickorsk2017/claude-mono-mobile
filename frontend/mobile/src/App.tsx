import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { useAuthenticationStore } from '@common/stores/use-authentication-store';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

setupIonicReact();

export default function App() {
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/auth" component={AuthPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
          <Route exact path="/">
            {currentUser ? <Redirect to="/dashboard" /> : <Redirect to="/auth" />}
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
