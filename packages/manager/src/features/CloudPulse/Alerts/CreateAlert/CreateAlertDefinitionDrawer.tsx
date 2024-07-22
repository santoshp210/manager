/* eslint-disable no-console */
import { APIError } from '@linode/api-v4';
import { CreateAlertDefinitionPayload } from '@linode/api-v4/lib/cloudpulse/types';
import { createAlertDefinitionSchema } from '@linode/validation';
import { FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
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
import { NotificationChannels } from './Custom/NotificationChannels';
import { TriggerConditions } from './Custom/TriggerConditions';
import { CloudViewRegionSelect } from './shared/RegionSelect';
import { CloudViewMultiResourceSelect } from './shared/ResourceMultiSelect';
import { CloudPulseServiceSelect } from './shared/ServicetypeSelect';

export interface CreateAlertDefinitionDrawerProps {
  createAlertPayload?: CreateAlertDefinitionPayload;
  onClose?: () => void;
  open?: boolean;
  onCancel: () => void;
}

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

const CreateAlertDefinitionDrawer = React.memo(
  (props: CreateAlertDefinitionDrawerProps) => {
    const { onClose, open } = props;
    const { mutateAsync } = useCreateAlertDefinition();
    const { enqueueSnackbar } = useSnackbar();

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
            handleGeneralErrors(
              mapErrorToStatus,
              err,
              'Error creating an alert'
            );
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

    React.useEffect(() => {
      if (open) {
        resetForm();
      }
    }, [open, resetForm]);

    // const [scrapeInterval, setScrapeInterval] = React.useState<string>('');

    // console.log(values);
    const generalError = status?.generalError;
    // console.log(errors);
    return (
      // <Drawer onClose={onClose} open={open} title={'Create'}>
      <Paper>
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
              // options={[
              //   { label: 'Info - 3', value: '3' },
              //   { label: 'Low -2 ', value: '2' },
              //   { label: 'Medium - 1', value: '1' },
              //   { label: 'Severe - 0', value: '0' },
              label={'Severity'}
              // ]}
              options={AlertSeverityOptions}
              size="medium"
              textFieldProps={{ labelTooltipText: 'Alert Severity' }}
            />
            <MetricCriteriaField
              // handleMetricChange={(value) => {
              //   const criterias = [value];
              //   setFieldValue('criteria', criterias);
              // }}
              // setScrapeInterval={(interval) => {
              //   setScrapeInterval(interval);
              // }}
              name="criteria"
              serviceType={values.serviceType ? values.serviceType : ''}
            />
            <TriggerConditions
              // handleConditionChange={(value) =>
              //   setFieldValue('triggerCondition', value)
              // }
              name="triggerCondition"
              // pollingInterval={scrapeInterval}
            />
            <NotificationChannels
              handleNotificationChange={(value) => {
                const notifications = [value];
                setFieldValue('notifications', notifications);
              }}
            />
            <ActionsPanel
              primaryButtonProps={{
                'data-testid': 'submit',
                label: 'Create alert',
                loading: isSubmitting,
                type: 'submit',
              }}
              secondaryButtonProps={{
                'data-testid': 'cancel',
                label: 'Cancel',
                onClick: props.onCancel,
              }}
            />
          </form>
        </FormikProvider>
      </Paper>
    );
  }
);

export default CreateAlertDefinitionDrawer;
