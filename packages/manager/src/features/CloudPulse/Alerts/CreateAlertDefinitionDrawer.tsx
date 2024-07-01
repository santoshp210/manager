/* eslint-disable no-console */
import { APIError } from '@linode/api-v4';
import { CreateAlertDefinitionPayload } from '@linode/api-v4/lib/cloudpulse/types';
import { createAlertDefinitionSchema } from '@linode/validation';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Drawer } from 'src/components/Drawer';
import { FormControlLabel } from 'src/components/FormControlLabel';
import { Notice } from 'src/components/Notice/Notice';
import { Radio } from 'src/components/Radio/Radio';
import { RadioGroup } from 'src/components/RadioGroup';
import { TagsInput } from 'src/components/TagsInput/TagsInput';
import { TextField } from 'src/components/TextField';
import { useCreateAlertDefinition } from 'src/queries/cloudpulse/alerts';
import { getErrorMap } from 'src/utilities/errorUtils';
import {
  handleFieldErrors,
  handleGeneralErrors,
} from 'src/utilities/formikErrorUtils';

import { CloudViewRegionSelect } from '../shared/RegionSelect';
import { CloudViewMultiResourceSelect } from '../shared/ResourceMultiSelect';
import { CloudPulseServiceSelect } from '../shared/ServicetypeSelect';
import { MetricCriteriaField } from './Custom/Metrics/MetricCriteria';
import { NotificationChannels } from './Custom/NotificationChannels';
import { TriggerConditions } from './Custom/TriggerConditions';

export interface CreateAlertDefinitionDrawerProps {
  createAlertPayload?: CreateAlertDefinitionPayload;
  onClose: () => void;
  open: boolean;
}

type Type = 'anomaly' | 'threshold';
const initialValues: CreateAlertDefinitionPayload = {
  alertName: null,
  criteria: [],
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

export const CreateAlertDefinitionDrawer = React.memo(
  (props: CreateAlertDefinitionDrawerProps) => {
    const { onClose, open } = props;
    const { mutateAsync } = useCreateAlertDefinition();
    const { enqueueSnackbar } = useSnackbar();

    const {
      errors,
      handleBlur,
      handleSubmit,
      isSubmitting,
      resetForm,
      setFieldValue,
      status,
      values,
    } = useFormik({
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
            onClose();
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
    // React.useEffect(() => {
    //   if (open) {
    //     resetForm();
    //   }
    // }, [open, resetForm]);
    // const [mode, setMode] = React.useState<Type>('threshold');

    // React.useEffect(() => {
    //   setFieldValue('type', mode.toString());
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [mode]);

    const [scrapeInterval, setScrapeInterval] = React.useState<string>('');

    const generalError = status?.generalError;
    return (
      <Drawer onClose={onClose} open={open} title={'Create'}>
        <form onSubmit={handleSubmit}>
          {generalError && (
            <Notice
              data-qa-error
              key={status}
              text={status?.generalError ?? 'An unexpected error occurred'}
              variant="error"
            />
          )}
          <TextField
            inputProps={{
              autoFocus: true,
            }}
            onChange={(event) => {
              setFieldValue('alertName', event.target.value);
              setFieldValue('type', 'anomaly');
            }}
            errorText={errors.alertName}
            label="Name"
            onBlur={handleBlur}
          />
          <TextField
            inputProps={{
              autoFocus: true,
            }}
            onChange={(event) =>
              setFieldValue('description', event.target.value)
            }
            errorText={errors.description}
            label="Description"
            onBlur={handleBlur}
            optional
          />
          <TagsInput
            onChange={(tags) =>
              setFieldValue(
                'tags',
                tags.map((tag) => tag.value)
              )
            }
            value={
              values?.tags?.map((tag) => ({ label: tag, value: tag })) ?? []
            }
            disabled={false}
          />
          <CloudPulseServiceSelect
            handleServiceChange={(value) => {
              setFieldValue('serviceType', value);
            }}
          />
          <CloudViewRegionSelect
            handleRegionChange={(value) => {
              setFieldValue('region', value);
            }}
          />
          <CloudViewMultiResourceSelect
            handleResourceChange={(resources) => {
              setFieldValue('resourceId', resources);
            }}
            disabled={false}
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
            options={[
              { label: 'Info - 3', value: '3' },
              { label: 'Low -2 ', value: '2' },
              { label: 'Medium - 1', value: '1' },
              { label: 'Severe - 0', value: '0' },
            ]}
            label={'Severity'}
            textFieldProps={{ labelTooltipText: 'Alert Severity' }}
          />
          <MetricCriteriaField
            handleMetricChange={(value) => {
              const criterias = [value];
              setFieldValue('criteria', criterias);
            }}
            setScrapeInterval={(interval) => {
              setScrapeInterval(interval);
            }}
            serviceType={values.serviceType ? values.serviceType : ''}
          />
          <TriggerConditions
            handleConditionChange={(value) =>
              setFieldValue('triggerCondition', value)
            }
            pollingInterval={scrapeInterval}
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
              label: 'Create',
              loading: isSubmitting,
              type: 'submit',
            }}
            secondaryButtonProps={{
              'data-testid': 'cancel',
              label: 'Cancel',
              onClick: onClose,
            }}
          />
        </form>
      </Drawer>
    );
  }
);
