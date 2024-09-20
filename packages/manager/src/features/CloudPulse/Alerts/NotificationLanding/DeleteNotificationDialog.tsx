import * as React from 'react';

import { TypeToConfirmDialog } from 'src/components/TypeToConfirmDialog/TypeToConfirmDialog';

interface Props {
  notification: any;
  onClose: () => void;
  open: boolean;
}
export const DeleteNotificationDialog = (props: Props) => {
  const { notification, onClose, open } = props;

  const onDelete = () => {
    onClose();
  };

  return (
    <TypeToConfirmDialog
      entity={{
        action: 'deletion',
        name: notification?.channelName,
        primaryBtnText: 'Delete',
        type: 'Notification',
      }}
      label="Channel Name"
      loading={false}
      onClick={onDelete}
      onClose={onClose}
      open={open}
      title={`Delete Notification ${notification?.channelName}?`}
      typographyStyle={{ marginTop: '10px' }}
    />
  );
};
