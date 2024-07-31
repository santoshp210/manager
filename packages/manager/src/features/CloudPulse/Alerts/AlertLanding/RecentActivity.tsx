import * as React from 'react';

import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';

import CreateAlertDefinitionDrawer from '../CreateAlert';

interface ActivityProps {
  onCancel: () => void;
  open: boolean;
}
export const RecentActivity = React.memo((props: ActivityProps) => {
  const { onCancel, open } = props;
  return (
    <Paper>
      <Typography variant="body1">Recent Activity</Typography>
      {open && <CreateAlertDefinitionDrawer onCancel={onCancel} />}
    </Paper>
  );
});
