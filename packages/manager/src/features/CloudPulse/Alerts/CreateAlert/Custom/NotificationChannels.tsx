import { Grid, Theme, Typography, useTheme } from '@mui/material';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';

interface NotificationChannelsProps {
  handleNotificationChange: (value: any) => void;
}

interface Notifications {
  content: {
    email: string;
  };
  notification_type: string;
}
export const NotificationChannels = React.memo(
  (props: NotificationChannelsProps) => {
    const [
      selectedActions,
      setSelectedActions,
    ] = React.useState<Notifications>();

    const changeActionValues = (value: any, field: string) => {
      if (!value) {
        return;
      }
      if (field === 'email') {
        const content = {
          email: value,
        };
        const tempActions = value && {
          ...selectedActions,
          ['content']: content,
        };
        setSelectedActions(tempActions);
        return;
      }
      const tempActions = value && { ...selectedActions, [field]: value };
      setSelectedActions(tempActions);
    };

    React.useEffect(() => {
      props.handleNotificationChange(selectedActions);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedActions]);

    const theme = useTheme<Theme>();
    return (
      <>
        <Typography sx={{ paddingTop: '25px' }} variant="h3">
          Notification Channels
        </Typography>
        <Typography variant="body1">
          When the alert triggers perform the following actions:
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.bg.app,
            marginTop: '10px',
            padding: '10px',
          }}
        >
          <Grid>
            <Typography>Channel Settings</Typography>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(_, value) => {
                changeActionValues(value?.value, 'notification_type');
              }}
              label="Type"
              options={[{ label: 'Send an Email', value: 'email' }]}
            ></Autocomplete>
            {/* <Autocomplete label="Template" options={[]}></Autocomplete> */}
            <TextField
              onChange={(event) =>
                changeActionValues(event.target.value, 'email')
              }
              inputMode="email"
              label={'To'}
            />
          </Grid>
        </Box>
      </>
    );
  }
);
