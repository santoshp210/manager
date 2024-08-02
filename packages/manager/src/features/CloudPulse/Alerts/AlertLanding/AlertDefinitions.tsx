import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';

import { CreateAlertDefinition } from '../CreateAlert/CreateAlertDefinition';

export const AlertDefinition = React.memo(() => {
  return (
    <Paper>
      <Typography variant="body1">Alert Definition</Typography>
      <Switch>
        <Route
          component={CreateAlertDefinition}
          path="/monitor/cloudpulse/alerts/definitions/create"
        />
      </Switch>
    </Paper>
  );
});
