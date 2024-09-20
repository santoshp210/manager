import { Grid } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Box } from 'src/components/Box';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { Typography } from 'src/components/Typography';

import { NotificationOverview } from './NotificationOverview';

import type { AlertNotification } from '@linode/api-v4';
interface NotificationDetailsProps {
  notifications: AlertNotification[];
}

interface RouteParams {
  notificationId: string;
}

export const NotificationDetails = (props: NotificationDetailsProps) => {
  const { notifications } = props;
  const { notificationId } = useParams<RouteParams>();
  const selectedNotification =
    notifications && notifications.length > 0
      ? notifications.find(
          (notification) => notification.id === Number(notificationId)
        )
      : null;
  const overrides = [
    {
      label: 'Notifications',
      linkTo: '/monitor/cloudpulse/alerts/notifications',
      position: 1,
    },
    {
      label: 'Details',
      linkTo: `/monitor/cloudpulse/alerts/notifications/details/${notificationId}`,
      position: 2,
    },
  ];
  return (
    <>
      <Breadcrumb
        crumbOverrides={overrides}
        pathname={'Notifications/details'}
      />
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
          borderRadius: 1,
          p: 1,
        })}
        p={3}
      >
        <Typography gutterBottom marginBottom={2} variant="h2">
          Overview:
        </Typography>
        {selectedNotification && (
          <NotificationOverview notification={selectedNotification} />
        )}
      </Box>
    </>
  );
};
