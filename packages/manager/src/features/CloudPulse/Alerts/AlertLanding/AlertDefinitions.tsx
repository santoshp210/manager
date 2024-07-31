import * as React from 'react';

import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';

import CreateAlertDefinitionDrawer from '../CreateAlert';

interface ActivityProps {
  onCancel: () => void;
  open: boolean;
}
export const AlertDefinition = React.memo((props: ActivityProps) => {
  const { onCancel, open } = props;
  return (
    <Paper>
      <Typography variant="body1">Alert Definition</Typography>
      {open && <CreateAlertDefinitionDrawer onCancel={onCancel} />}
    </Paper>
  );
});
