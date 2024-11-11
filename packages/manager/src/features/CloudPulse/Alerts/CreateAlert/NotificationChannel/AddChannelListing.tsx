import { Box } from '@linode/ui';
import ClearOutlineOutlined from '@mui/icons-material/ClearOutlined';
import { Grid, styled } from '@mui/material';
import React from 'react';

import { Button } from 'src/components/Button/Button';
import { Chip } from 'src/components/Chip';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';

import type { NotificationChannel } from '@linode/api-v4';

interface ChannelListProps {
  notifications: NotificationChannel[];
  onChangeNotifications: (notifications: NotificationChannel[]) => void;
  onClickAddNotification: () => void;
}

export const AddChannelListing = (props: ChannelListProps) => {
  const {
    notifications,
    onChangeNotifications,
    onClickAddNotification,
  } = props;
  const handleRemove = (index: number) => {
    const newList = notifications.filter((_, i) => i !== index);
    onChangeNotifications(newList);
  };
  // console.log(notifications);
  return (
    <>
      <Typography marginBottom={1} marginTop={3} variant="h2">
        3. Notification Channels
      </Typography>
      <Stack spacing={1}>
        {notifications.length > 0 &&
          notifications.map((notification, id) => {
            return (
              <Box
                sx={(theme) => ({
                  backgroundColor:
                    theme.name === 'light'
                      ? theme.color.grey5
                      : theme.color.grey9,
                  borderRadius: 1,
                  p: 1,
                })}
                key={id}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    width: '100%',
                  }}
                >
                  <Typography variant="h3"> {notification.label}</Typography>
                  <StyledDeleteIcon onClick={() => handleRemove(id)} />
                </Box>
                <Grid container paddingLeft={2}>
                  <Grid item md={1} paddingBottom={1}>
                    <Typography variant="h3">Type:</Typography>
                  </Grid>
                  <Grid item md={11}>
                    <Typography variant="subtitle2">
                      {notification.channel_type}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container paddingLeft={2}>
                  <Grid alignContent={'center'} item md={1}>
                    <Typography variant="h3">To:</Typography>
                  </Grid>
                  <Grid item md={11}>
                    {notification.content &&
                      notification.channel_type === 'email' &&
                      notification.content.channel_type.email_addresses.length >
                        0 &&
                      notification.content.channel_type.email_addresses.map(
                        (email: string, id: number) => (
                          <Chip key={id} label={email} />
                        )
                      )}
                  </Grid>
                </Grid>
              </Box>
            );
          })}
      </Stack>
      <Box mt={1}>
        <Button
          buttonType={'outlined'}
          onClick={onClickAddNotification}
          size="medium"
        >
          Add notification channel
        </Button>
      </Box>
    </>
  );
};

const StyledDeleteIcon = styled(ClearOutlineOutlined)(({ theme }) => ({
  '&:active': {
    transform: 'scale(0.9)',
  },
  '&:hover': {
    color: theme.color.blue,
  },
  color: theme.palette.text.primary,
  cursor: 'pointer',
  padding: 0,
}));
