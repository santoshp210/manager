import { Chip, Typography } from '@linode/ui';
import { Box } from '@linode/ui';
import { Grid } from '@mui/material';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

import { ChannelTypeOptions } from '../../constants';

import type { ChannelTypes, NotificationChannel } from '@linode/api-v4';

interface AddNotificationChannelProps {
  onCancel: () => void;
  onClickAddNotification: (notifications: any) => void;
  templateData: NotificationChannel[];
}

type AutocompleteOptions = {
  label: string;
  value: string;
};

export const AddNotificationChannel = (props: AddNotificationChannelProps) => {
  const [
    selectedType,
    setSelectedType,
  ] = React.useState<AutocompleteOptions | null>(null);
  const [
    selectedChannel,
    setSelectedChannel,
  ] = React.useState<AutocompleteOptions | null>(null);
  //   const [disableValidation, setDisableValidation] = React.useState(false);
  const { onCancel, onClickAddNotification, templateData } = props;

  const formMethods = useForm<NotificationChannel>({
    mode: 'onBlur',
    // resolver: yupResolver()
  });

  const { control, handleSubmit, setValue, watch } = formMethods;
  const onSubmit = handleSubmit((values) => {
    onClickAddNotification(values);
  });

  React.useEffect(() => {
    setValue('channel_type', selectedType?.value as ChannelTypes);
  }, [setValue, selectedType]);

  React.useEffect(() => {
    setValue('label', selectedChannel?.value ?? '');
  }, [selectedChannel, setValue]);

  const typeWatcher = watch(`channel_type`);
  const selectedTypeTemplate =
    typeWatcher && templateData
      ? templateData.filter((template) => template.channel_type === typeWatcher)
      : null;
  const templateOptions = selectedTypeTemplate
    ? selectedTypeTemplate.map((template) => ({
        label: template.label,
        value: template.label,
      }))
    : [];

  const selectedTemplate = selectedTypeTemplate?.find(
    (template) => template.label === watch('label')
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
            borderRadius: 1,
            p: 2,
          })}
        >
          <Typography
            gutterBottom
            sx={(theme) => ({ color: theme.color.black })}
            variant="body2"
          >
            Channel settings
          </Typography>
          <Controller
            render={({ field }) => (
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                label="Type"
                onBlur={field.onBlur}
                onChange={(_, newValue) => setSelectedType(newValue)}
                options={ChannelTypeOptions}
                value={selectedType}
              />
            )}
            control={control}
            name={'channel_type'}
          />
          <Box>
            <Controller
              render={({ field }) => (
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  label="Channel"
                  onBlur={field.onBlur}
                  onChange={(_, newValue) => setSelectedChannel(newValue)}
                  options={templateOptions}
                  value={selectedChannel}
                />
              )}
              control={control}
              name={'label'}
            />
          </Box>

          {selectedTemplate && (
            <Box paddingTop={2}>
              <Grid container>
                <Grid item md={2}>
                  <Typography variant="h3">To:</Typography>
                </Grid>
                <Grid item md={10}>
                  {selectedTemplate.content &&
                    selectedTemplate.channel_type === 'email' &&
                    selectedTemplate.content.channel_type.email_addresses
                      .length > 0 &&
                    selectedTemplate.content.channel_type.email_addresses.map(
                      (email: string, id: number) => (
                        <Chip key={id} label={email} />
                      )
                    )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        <ActionsPanel
          primaryButtonProps={{
            label: 'Add channel',
            type: 'submit',
          }}
          secondaryButtonProps={{
            label: 'Cancel',
            onClick: onCancel,
          }}
        />
      </form>
    </FormProvider>
  );
};
