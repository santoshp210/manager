import { Grid } from '@mui/material';
import React from 'react';

import { Chip } from 'src/components/Chip';
import { Typography } from 'src/components/Typography';

import type { AlertNotification } from '@linode/api-v4';

interface NotificatinoOverviewProps {
  notification: AlertNotification;
}

export const NotificationOverview = (props: NotificatinoOverviewProps) => {
  const { notification } = props;
  return (
    <Grid container spacing={1}>
      <Grid item sm={2} xs={3}>
        <Typography variant="h3">Type:</Typography>
      </Grid>
      <Grid item sm={10} xs={9}>
        <Typography variant="subtitle2">{notification.type}</Typography>
      </Grid>
      <Grid item sm={2} xs={3}>
        <Typography variant="h3">Channel Name:</Typography>
      </Grid>
      <Grid item sm={10} xs={9}>
        <Typography variant="subtitle2">{notification.channelName}</Typography>
      </Grid>
      <Grid alignContent={'center'} item sm={2} xs={12}>
        <Typography variant="h3">To:</Typography>
      </Grid>
      {notification.type === 'Email' && (
        <Grid item sm={10} xs={12}>
          {notification?.values &&
            notification?.values.to.length > 0 &&
            notification.values.to.map((email: string, id: number) => (
              <Chip key={id} label={email} variant="outlined" />
            ))}
        </Grid>
      )}
    </Grid>
  );
};
