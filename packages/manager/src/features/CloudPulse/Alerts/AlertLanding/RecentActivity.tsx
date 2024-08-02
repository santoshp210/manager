import * as React from 'react';

import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';

export const RecentActivity = React.memo(() => {

  return (
    <Paper>
      <Typography variant="body1">Recent Activity</Typography>
    </Paper>
  );
});
