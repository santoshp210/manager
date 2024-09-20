import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { Link } from 'src/components/Link';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';

import { NotificationActionMenu } from '../NotificationDetails/NotificationActionMenu';

import type { ActionHandlers } from '../NotificationDetails/NotificationActionMenu';
import type { AlertNotification } from '@linode/api-v4';

interface NotificationTableRowProps {
  handlers: ActionHandlers;
  notification: AlertNotification;
}

export const NotificationTableRow = (props: NotificationTableRowProps) => {
  const { handlers, notification } = props;
  const history = useHistory();
  const handleClickDetails = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    history.replace(
      `/monitor/cloudpulse/alerts/notifications/details/${notification.id}`
    );
  };
  return (
    <TableRow
      data-qa-alert-cell={notification.id}
      key={`alert-row-${notification.id}`}
    >
      <TableCell colSpan={2}>
        <Link
          onClick={handleClickDetails}
          to={`/monitor/cloudpulse/alerts/notifications/details/${notification.id}`}
        >
          {notification.channelName}
        </Link>
      </TableCell>
      <TableCell>{notification.type}</TableCell>
      <TableCell>{notification.lastModified}</TableCell>
      <TableCell>{notification.createdBy}</TableCell>
      <TableCell actionCell>
        <NotificationActionMenu
          handlers={handlers}
          notification={notification}
        />
      </TableCell>
    </TableRow>
  );
};
