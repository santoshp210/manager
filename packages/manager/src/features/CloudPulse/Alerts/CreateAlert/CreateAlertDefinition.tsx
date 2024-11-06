import { yupResolver } from '@hookform/resolvers/yup';
import { createAlertDefinitionSchema } from '@linode/validation';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { Drawer } from 'src/components/Drawer';
import { Paper } from '@linode/ui';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
import {
  useCreateAlertDefinition,
  useNotificationChannels,
} from 'src/queries/cloudpulse/alerts';
import { useDatabaseEnginesQuery } from 'src/queries/databases/databases';

import { MetricCriteriaField } from './Criteria/MetricCriteria';
import { TriggerConditions } from './Criteria/TriggerConditions';
import { CloudPulseAlertSeveritySelect } from './GeneralInformation/AlertSeveritySelect';
import { EngineOption } from './GeneralInformation/EngineOption';
import { CloudPulseRegionSelect } from './GeneralInformation/RegionSelect';
import { CloudPulseMultiResourceSelect } from './GeneralInformation/ResourceMultiSelect';
import { CloudPulseServiceSelect } from './GeneralInformation/ServiceTypeSelect';
import { AddChannelListing } from './NotificationChannel/AddChannelListing';
import { AddNotificationChannel } from './NotificationChannel/AddNotificationChannel';

import type {
  CreateAlertDefinitionPayload,
  MetricCriteria,
  NotificationChannel,
  TriggerCondition,
} from '@linode/api-v4/lib/cloudpulse/types';

const triggerConditionInitialValues: TriggerCondition = {
  evaluation_period_seconds: 0,
  polling_interval_seconds: 0,
  trigger_occurrences: 0,
};
const criteriaInitialValues: MetricCriteria[] = [
  {
    aggregation_type: '',
    dimension_filters: [],
    metric: '',
    operator: '',
    threshold: 0,
  },
];
export const initialValues: CreateAlertDefinitionPayload = {
  channel_ids: [],
  label: '',
  resource_ids: [],
  rule_criteria: { rules: criteriaInitialValues },
  service_type: '',
  severity: '',
  triggerCondition: triggerConditionInitialValues,
};

const generateCrumbOverrides = () => {
  const overrides = [
    {
      label: 'Definitions',
      linkTo: '/monitor/cloudpulse/alerts/definitions',
      position: 1,
    },
    {
      label: 'Details',
      linkTo: `/monitor/cloudpulse/alerts/definitions/create`,
      position: 2,
    },
  ];
  return { newPathname: '/Definitions/Details', overrides };
};

export const CreateAlertDefinition = React.memo(() => {
  const {
    data: engineOptions,
    isError: engineOptionError,
    isLoading: engineOptionLoading,
  } = useDatabaseEnginesQuery(true);

  // const {
  //   data: notificationChannels,
  //   isError: notificationChannelError,
  //   isLoading: notificationChannelLoading,
  // } = useNotificationChannels();

  const history = useHistory();
  const alertCreateExit = () => {
    const pathParts = location.pathname.split('/');
    pathParts.pop();
    const previousPage = pathParts.join('/');
    history.push(previousPage);
  };

  const formMethods = useForm<CreateAlertDefinitionPayload>({
    defaultValues: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(createAlertDefinitionSchema),
  });

  const [maxScrapeInterval, setMaxScrapeInterval] = React.useState<number>(0);
  // const [openAddNotification, setOpenAddNotification] = React.useState(false);
  // const [notifications, setNotifications] = React.useState<
  //   NotificationChannel[]
  // >([]);
  const {
    control,
    formState,
    handleSubmit,
    setError,
    setValue,
    watch,
  } = formMethods;
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createAlert } = useCreateAlertDefinition(
    watch('service_type')
  );

  // const onChangeNotifications = (notifications: NotificationChannel[]) => {
  //   const notificationTemplateList = notifications.map(
  //     (notification) => notification.id
  //   ); 
  //   setValue('channel_ids', notificationTemplateList);
  // };

  // const onSubmitAddNotification = (notification: NotificationChannel) => {
  //   const newNotifications = [...notifications, notification];
  //   const notificationTemplateList = newNotifications.map(
  //     (notification) => notification.id
  //   );
  //   setValue('channel_ids', notificationTemplateList);
  //   setNotifications(newNotifications);
  //   setOpenAddNotification(false);
  // };

  const onSubmit = handleSubmit(async (values) => {
    try {

      await createAlert(values);
      enqueueSnackbar('Alert successfully created', {
        variant: 'success',
      });
      alertCreateExit();
    } catch (errors) {
      for (const error of errors) {
        if (error.field) {
          setError(error.field, { message: error.reason });
        } else {
          setError('root', { message: error.reason });
        }
      }
    }
  });

  const { newPathname, overrides } = generateCrumbOverrides();

  const engineOptionValue = watch('service_type');
  return (
    <Paper>
      <Breadcrumb
        crumbOverrides={overrides}
        pathname={newPathname}
      ></Breadcrumb>
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit}>
          <Typography variant="h2">1. General Information</Typography>
          <Controller
            render={({ field, fieldState }) => (
              <TextField
                data-testid="alert-name"
                errorText={fieldState.error?.message}
                label="Name"
                name={'label'}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.value)}
                value={field.value ?? ''}
              />
            )}
            control={control}
            name="label"
          />
          <Controller
            render={({ field, fieldState }) => (
              <TextField
                errorText={fieldState.error?.message}
                label="Description"
                name={'description'}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.value)}
                optional
                value={field.value ?? ''}
              />
            )}
            control={control}
            name="description"
          />
          <CloudPulseServiceSelect name="service_type" />
          {engineOptionValue === 'dbaas' && (
            <EngineOption
              engineOptions={engineOptions ?? []}
              isError={!!engineOptionError}
              isLoading={engineOptionLoading}
              name={'engineOption'}
            />
          )}
          <CloudPulseRegionSelect name="region" />
          <CloudPulseMultiResourceSelect
            engine={engineOptionValue}
            name="resource_ids"
            region={watch('region')}
            serviceType={watch('service_type')}
          />
          <CloudPulseAlertSeveritySelect name="severity" />
          <MetricCriteriaField
            getMaxInterval={(interval: number) =>
              setMaxScrapeInterval(interval)
            }
            name="criteria"
            serviceType={watch('service_type')}
          />
          <TriggerConditions
            maxScrapingInterval={maxScrapeInterval}
            name={'triggerCondition'}
          />
          {/* <AddChannelListing
            notifications={notifications}
            onChangeNotifications={onChangeNotifications}
            onClickAddNotification={() => setOpenAddNotification(true)}
          /> */}
          <ActionsPanel
            primaryButtonProps={{
              label: 'Submit',
              loading: formState.isSubmitting,
              type: 'submit',
            }}
            secondaryButtonProps={{
              label: 'Cancel',
              onClick: alertCreateExit,
            }}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          />
        </form>
      </FormProvider>
      {/* {openAddNotification && (
        <Drawer
          onClose={() => setOpenAddNotification(false)}
          open={openAddNotification}
          title="Add Notification Channel"
        >
          <AddNotificationChannel
            onCancel={() => setOpenAddNotification(false)}
            onClickAddNotification={onSubmitAddNotification}
            templateData={notificationChannels?.data ?? []}
          />
        </Drawer>
      )} */}
    </Paper>
  );
});
