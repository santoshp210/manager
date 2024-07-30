import React from "react";
import { Box } from "src/components/Box";
import { Typography } from "src/components/Typography";
import { Button } from "src/components/Button/Button";
import { Grid, styled } from "@mui/material";
import { Stack } from "src/components/Stack";
import { Chip } from "src/components/Chip";
import { DeleteOutlineOutlined } from "@mui/icons-material";

interface ChannelListProps {
  notifications: any[];
  onChangleNotifications: (notifications: any[]) => void;
  onClickAddNotification: () => void;
};

export const AddChannelListing = (props: ChannelListProps) => {
  const {notifications, onChangleNotifications, onClickAddNotification} = props;
  const handleRemove = (index: number) => {
    const newList = notifications.filter((_, i) => i !== index);
    onChangleNotifications(newList);
  }
  return (
    <>
    <Typography variant="h2" marginTop={1} marginBottom={1}>3. Notification Channels</Typography>
    <Stack spacing={1}>
    {
      notifications.length > 0 && notifications.map(( notification, id) => {
        return <Box key={id} sx={(theme) => ({ p: 1, backgroundColor: theme.name === 'light' ? theme.color.grey5 : theme.color.grey9, borderRadius: 1 })}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, width: '100%' }} >
            <Typography variant="h3"> {notification.templateName}</Typography>
            <StyledDeleteIcon onClick={() => handleRemove(id)}/>
          </Box>
          <Grid container paddingLeft={2}>
            <Grid item md={1} paddingBottom={1}>
                <Typography variant="h3">Type:</Typography>
            </Grid>
            <Grid item md={11}>
                <Typography >{notification.type}</Typography>
            </Grid>
          </Grid>
          <Grid container paddingLeft={2}>
            <Grid item md={1} alignContent={"center"}>
                <Typography variant="h3">To:</Typography>
            </Grid>
            <Grid item md={11}>
              {
                notification.values && notification.values.to.length > 0 && notification.values.to.map((email: string, id: number) => (
                  <Chip label={email} key={id} />
                ))
              }
            </Grid>
          </Grid>
        </Box>
      })
    }
    </Stack>
    <Box mt={1}>
      <Button
        onClick={onClickAddNotification}
        buttonType={'outlined'}
        size="medium"
      >
        Add notification channel
      </Button>
    </Box>
    </>
  )
}

const StyledDeleteIcon = styled(DeleteOutlineOutlined)(({ theme }) => ({
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