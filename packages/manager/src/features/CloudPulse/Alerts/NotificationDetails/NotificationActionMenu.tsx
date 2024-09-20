import * as React from 'react';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import { getRestrictedResourceText } from 'src/features/Account/utils';

import type { AlertNotification } from '@linode/api-v4';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

export interface ActionHandlers {
  handleDelete: () => void;
  handleDetails: () => void;
}

export interface Props {
  handlers: ActionHandlers;
  notification: AlertNotification;
}

export const NotificationActionMenu = (props: Props) => {
  const { handlers } = props;
  const actions: Action[] = [
    {
      disabled: false,
      onClick: handlers.handleDetails,
      title: 'Show Details',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'view',
            isSingular: true,
            resourceType: 'Notifications',
          })
        : undefined,
    },
    {
      disabled: false,
      onClick: handlers.handleDelete,
      title: 'Delete',
      tooltip: false
        ? getRestrictedResourceText({
            action: 'delete',
            isSingular: true,
            resourceType: 'Notifications',
          })
        : undefined,
    },
  ];

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Notification menu for Notifications`}
    />
  );
};
