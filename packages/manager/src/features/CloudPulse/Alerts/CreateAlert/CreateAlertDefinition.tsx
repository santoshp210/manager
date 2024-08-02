import { APIError } from '@linode/api-v4';
import { CreateAlertDefinitionPayload } from '@linode/api-v4/lib/cloudpulse/types';
import { createAlertDefinitionSchema } from '@linode/validation';
import { FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { Notice } from 'src/components/Notice/Notice';
import { Paper } from 'src/components/Paper';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
import { useCreateAlertDefinition } from 'src/queries/cloudpulse/alerts';
import { getErrorMap } from 'src/utilities/errorUtils';
import {
  handleFieldErrors,
  handleGeneralErrors,
} from 'src/utilities/formikErrorUtils';

import { AlertSeverityOptions } from '../constants';
import { MetricCriteriaField } from './Custom/Metrics/MetricCriteria';
import { TriggerConditions } from './Custom/TriggerConditions';
import { CloudViewRegionSelect } from './shared/RegionSelect';
import { CloudViewMultiResourceSelect } from './shared/ResourceMultiSelect';
import { CloudPulseServiceSelect } from './shared/ServicetypeSelect';
import { Drawer } from 'src/components/Drawer';
import { AddChannelListing } from './AddChannelListing';
import { AddNotificationChannel } from './AddNotificationChannel';

const initialValues: CreateAlertDefinitionPayload = {
  alertName: null,
  criteria: [
    {
      aggregationType: '',
      filters: [],
      metric: '',
      operator: '',
      value: 0,
    },
  ],
  notifications: [],
  region: null,
  resourceId: [],
  serviceType: null,
  severity: '',
  triggerCondition: {
    criteriaCondition: '',
    evaluationInterval: '',
    evaluationPeriod: '',
    triggerOccurrence: '',
  },
  type: '',
};

export const CreateAlertDefinition = React.memo(() => {
  // const history = useHistory();
  // const { onClose, open } = props;
  const [ openAddNotification, setOpenAddNotification] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any>([]);
  const { mutateAsync } = useCreateAlertDefinition();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmitAddNotification = (notification: any) => {
    const newNotifications = [...notifications, notification];
    const notificationTemplateList = newNotifications.map(( notification => notification.templateName));
    formik.setFieldValue("notifications",notificationTemplateList);
    setNotifications(newNotifications);
    setOpenAddNotification(false);
  }

  const onChangleNotifications = (notifications : any[]) => {
    setNotifications(notifications);
    const notificationTemplateList = notifications.map(( notification => notification.templateName));
    formik.setFieldValue("notifications", notificationTemplateList);
  }

  const formik = useFormik({
    initialValues,
    onSubmit(
      values: CreateAlertDefinitionPayload,
      { setErrors, setStatus, setSubmitting }
    ) {
      setStatus(undefined);
      setErrors({});
      const payload = { ...values };

      mutateAsync(payload)
        .then(() => {
          setSubmitting(false);
          enqueueSnackbar(`Alert created`, {
            variant: 'success',
          });
        })
        .catch((err: APIError[]) => {
          const mapErrorToStatus = () =>
            setStatus({ generalError: getErrorMap([], err).none });
          setSubmitting(false);
          handleFieldErrors(setErrors, err);
          handleGeneralErrors(mapErrorToStatus, err, 'Error creating an alert');
        });
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: createAlertDefinitionSchema,
  });

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldValue,
    status,
    values,
  } = formik;

  const [maxScrapeInterval, setMaxScrapeInterval] = React.useState<number>(0);

  const generalError = status?.generalError;
  const history = useHistory();
  const onCancel = () => {
    history.goBack();
  };
  return (
    <Paper>
      <Breadcrumb pathname={location.pathname}></Breadcrumb>
      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          {generalError && (
            <Notice
              data-qa-error
              key={status}
              text={status?.generalError ?? 'An unexpected error occurred'}
              variant="error"
            />
          )}
          <Typography variant="h2">1. General Information</Typography>
          <TextField
            inputProps={{
              autoFocus: true,
            }}
            errorText={errors.alertName}
            label="Name"
            name={'alertName'}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <TextField
            inputProps={{
              autoFocus: true,
            }}
            errorText={errors.description}
            label="Description"
            name={'description'}
            onBlur={handleBlur}
            onChange={handleChange}
            optional
          />
          <CloudPulseServiceSelect name={'serviceType'} />
          <CloudViewRegionSelect
            handleRegionChange={(value) => {
              setFieldValue('region', value);
            }}
            name={'region'}
          />
          <CloudViewMultiResourceSelect
            handleResourceChange={(resources) => {
              setFieldValue('resourceId', resources);
            }}
            cluster={values.serviceType === 'db' ? true : false}
            disabled={false}
            name={'resourceId'}
            region={values.region ? values.region : ''}
            resourceType={values.serviceType ? values.serviceType : ''}
          />
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(_, value) => {
              setFieldValue('severity', value?.value);
            }}
            label={'Severity'}
            options={AlertSeverityOptions}
            size="medium"
            textFieldProps={{ labelTooltipText: 'Choose the alert severity' }}
          />
          <MetricCriteriaField
            getMaxInterval={(interval: number) =>
              setMaxScrapeInterval(interval)
            }
            name="criteria"
            serviceType={'linode'}
          />
          <TriggerConditions
            maxScrapingInterval={maxScrapeInterval}
            name="triggerCondition"
          />
          <AddChannelListing
            notifications={notifications}
            onChangleNotifications={onChangleNotifications}
            onClickAddNotification={() => setOpenAddNotification(true)}
          />
          <ActionsPanel
            primaryButtonProps={{
              'data-testid': 'submit',
              label: 'Submit',
              loading: isSubmitting,
              type: 'submit',
            }}
            secondaryButtonProps={{
              'data-testid': 'cancel',
              label: 'Cancel',
              onClick: onCancel,
            }}
            sx={{ paddingLeft: '850px ', paddingTop: '5px' }}
          />
        </form>
      </FormikProvider>
      {
        openAddNotification && 
        <Drawer title="Add Notification Channel" onClose={() => setOpenAddNotification(false)} open={openAddNotification}>
          <AddNotificationChannel
              onCancel={() => setOpenAddNotification(false)}
              onClickAddNotification={onSubmitAddNotification}
              options={[]}
            />
        </Drawer>
      }
    </Paper>
  );
});

