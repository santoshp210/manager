import { Grid } from '@mui/material';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Chip } from 'src/components/Chip';
import { Typography } from 'src/components/Typography';

import { ChannelTypeOptions } from '../../constants';

import type { NotificationChannel } from '@linode/api-v4';

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
    setValue('notification_type', selectedType?.value ?? '');
  }, [setValue, selectedType]);

  React.useEffect(() => {
    setValue('template_name', selectedChannel?.value ?? '');
  }, [selectedChannel, setValue]);

  const typeWatcher = watch(`notification_type`);
  const selectedTypeTemplate =
    typeWatcher && templateData
      ? templateData.filter(
          (template) => template.notification_type === typeWatcher
        )
      : null;
  const templateOptions = selectedTypeTemplate
    ? selectedTypeTemplate.map((template) => ({
        label: template.template_name,
        value: template.template_name,
      }))
    : [];

  const selectedTemplate = selectedTypeTemplate?.find(
    (template) => template.template_name === watch('template_name')
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
            name={'notification_type'}
          ></Controller>
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
              name={'template_name'}
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
                    selectedTemplate.content.email_ids.length > 0 &&
                    selectedTemplate.content.email_ids.map(
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
