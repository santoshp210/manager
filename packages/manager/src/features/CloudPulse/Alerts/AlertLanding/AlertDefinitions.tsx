import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CreateAlertDefinition } from '../CreateAlert/CreateAlertDefinition';
import { AlertDefinitionDetail } from './AlertDefinitionDetail';

export const AlertDefinition = () => {
  return (
    <Switch>
      <Route
        component={AlertDefinitionDetail}
        exact
        path="/monitor/cloudpulse/alerts/definitions"
      />
      <Route
        component={() => <CreateAlertDefinition />}
        path="/monitor/cloudpulse/alerts/definitions/create"
      />
    </Switch>
  );
};
