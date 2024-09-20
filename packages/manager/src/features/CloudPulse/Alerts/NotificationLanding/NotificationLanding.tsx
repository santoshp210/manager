import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { useOrder } from 'src/hooks/useOrder';
import { usePagination } from 'src/hooks/usePagination';

import { NotificationDetails } from '../NotificationDetails/NotificationDetails';
import { NotificationListing } from './NotificationListing';

import type { AlertNotification } from '@linode/api-v4';

const useNotificationsQuery = (info, filters) => {
  const data: AlertNotification[] = [
    {
      channelName: 'Email-05/2024',
      createdBy: 'satkumar',
      id: 2432432532,
      lastModified: '13 Sept, 2024',
      type: 'Email',
      values: {
        to: ['satkumar@akamai.com', 'satrunjay@akamai.com'],
      },
    },
    {
      channelName: 'Email-07/2024',
      createdBy: 'satkumar',
      id: 848743243,
      lastModified: '13 Sept, 2024',
      type: 'Email',
      values: {
        to: ['satkumar@akamai.com', 'satrunjay@akamai.com'],
      },
    },
  ];
  return {
    data,
    error: {},
    isLoading: false,
  };
};

const preferenceKey = 'notifications';
export const NotificationLanding = () => {
  const [searchText, setSearchText] = React.useState('');
  const pagination = usePagination(1, preferenceKey);

  const { handleOrderChange, order, orderBy } = useOrder(
    {
      order: 'desc',
      orderBy: 'channelName',
    },
    `${preferenceKey}-order`
  );

  const filter = {
    ['+order']: order,
    ['+order_by']: orderBy,
  };

  const { data: notifications, error, isLoading } = useNotificationsQuery(
    {
      page: pagination.page,
      page_size: pagination.pageSize,
    },
    filter
  );
  return (
    <Switch>
      <Route exact path="/monitor/cloudpulse/alerts/notifications">
        <NotificationListing
          error={error}
          handleOrderChange={handleOrderChange}
          isLoading={isLoading}
          notifications={notifications}
          onSearch={(text) => setSearchText(text)}
          order={order}
          orderBy={orderBy}
          searchText={searchText}
          // handleSelect={(notification) => setSelectedNotification(notification)}
        />
      </Route>
      <Route
        exact
        path="/monitor/cloudpulse/alerts/notifications/details/:notificationId"
      >
        <NotificationDetails notifications={notifications} />
      </Route>
    </Switch>
  );
};
