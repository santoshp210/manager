import { APIError } from '@linode/api-v4';
import { CreateAlertDefinitionPayload } from '@linode/api-v4/lib/cloudpulse/types';
import { createAlertDefinitionSchema } from '@linode/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { Drawer } from 'src/components/Drawer';
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
import { AddChannelListing } from './AddChannelListing';
import { AddNotificationChannel } from './AddNotificationChannel';
import { MetricCriteriaField } from './Custom/Metrics/MetricCriteria';
import { TriggerConditions } from './Custom/TriggerConditions';
import { EngineOption } from './shared/EngineOption';
import { CloudPulseRegionSelect } from './shared/RegionSelect';
import { CloudPulseMultiResourceSelect } from './shared/ResourceMultiSelect';
import { CloudPulseServiceSelect } from './shared/ServicetypeSelect';

export const initialValues: CreateAlertDefinitionPayload = {
  alertName: '',
  criteria: [
    {
      aggregationType: '',
      filters: [],
      metric: '',
      operator: '',
      value: 0,
    },
  ],
  engineOption: '',
  notifications: [],
  region: '',
  resourceId: [],
  serviceType: '',
  severity: '',
  triggerCondition: {
    criteriaCondition: '',
    evaluationPeriod: '',
    pollingInterval: '',
    triggerOccurrence: 0,
  },
};

export const CreateAlertDefinition = React.memo(() => {
  const [openAddNotification, setOpenAddNotification] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any>([]);
  const { mutateAsync } = useCreateAlertDefinition();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmitAddNotification = (notification: any) => {
    const newNotifications = [...notifications, notification];
    const notificationTemplateList = newNotifications.map(
      (notification) => notification.templateName
    );
    formik.setFieldValue('notifications', notificationTemplateList);
    setNotifications(newNotifications);
    setOpenAddNotification(false);
  };

  const onChangleNotifications = (notifications: any[]) => {
    setNotifications(notifications);
    const notificationTemplateList = notifications.map(
      (notification) => notification.templateName
    );
    formik.setFieldValue('notifications', notificationTemplateList);
  };

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
    validateOnBlur: true,
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

  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );
  // eslint-disable-next-line no-console
  console.log(formik.touched);
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
            // errorText="Name error"
            label="Name"
            name={'alertName'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.alertName ? values.alertName : ''}
          />
          {formik.touched && formik.touched.alertName && errors.alertName ? (
            <ErrorMessage component={CustomErrorMessage} name="alertName" />
          ) : null}
          <TextField
            label="Description"
            name={'description'}
            onBlur={handleBlur}
            onChange={handleChange}
            optional
            value={values.description ? values.description : ''}
          />
          <CloudPulseServiceSelect name={'serviceType'} />
          {formik.touched &&
          formik.touched.serviceType &&
          errors.serviceType ? (
            <ErrorMessage component={CustomErrorMessage} name="serviceType" />
          ) : null}
          {formik.values.serviceType === 'dbaas' && (
            <EngineOption name={'engineOption'} />
          )}
          <CloudPulseRegionSelect name={'region'}/>
          {/* {formik.touched && errors.region ? (
            <>
              <p>Region Change</p>
              <ErrorMessage component={CustomErrorMessage} name="region" />
            </>
          ) : null} */}
          <CloudPulseMultiResourceSelect
            handleResourceChange={(resources) => {
              setFieldValue('resourceId', resources);
            }}
            cluster={values.serviceType === 'db' ? true : false}
            disabled={false}
            name={'resourceId'}
            region={values.region ? values.region : ''}
            resourceType={values.serviceType ? values.serviceType : ''}
          />
          {formik.touched &&
          formik.touched.resourceId &&
          formik.errors.resourceId ? (
            <ErrorMessage component={CustomErrorMessage} name="resourceId" />
          ) : null}
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched('severity', true);
            }}
            onChange={(_, value) => {
              setFieldValue('severity', value?.value);
              formik.setFieldTouched('severity', true);
            }}
            value={
              values?.severity
                ? {
                    label: values.severity,
                    value: values.severity,
                  }
                : null
            }
            label={'Severity'}
            options={AlertSeverityOptions}
            size="medium"
            textFieldProps={{ labelTooltipText: 'Choose the alert severity' }}
          />
          {formik.touched &&
          formik.touched.severity &&
          formik.errors.severity ? (
            <ErrorMessage component={CustomErrorMessage} name="severity" />
          ) : null}
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
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          />
        </form>
      </FormikProvider>
      {openAddNotification && (
        <Drawer
          onClose={() => setOpenAddNotification(false)}
          open={openAddNotification}
          title="Add Notification Channel"
        >
          <AddNotificationChannel
            onCancel={() => setOpenAddNotification(false)}
            onClickAddNotification={onSubmitAddNotification}
            options={[]}
          />
        </Drawer>
      )}
    </Paper>
  );
});
