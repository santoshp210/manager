import * as React from 'react';

import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';

import CreateAlertDefinitionDrawer from '../CreateAlert';
import { Route, Switch } from 'react-router-dom';

// interface ActivityProps {
//   onCancel: () => void;
//   open: boolean;
// }
export const AlertDefinition = React.memo(() => {
  return (
    <Paper>
      <Typography variant="body1">Alert Definition</Typography>
      <Switch>
        <Route path="/monitor/cloudpulse/alerts/definitions/create" component={CreateAlertDefinitionDrawer}/>
      </Switch>
    </Paper>
  );
});
