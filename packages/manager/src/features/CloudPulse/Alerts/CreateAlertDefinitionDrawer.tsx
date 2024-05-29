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
import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
import { TagsInput } from 'src/components/TagsInput/TagsInput';
import { TextField } from 'src/components/TextField';
import { useCreateAlertDefinition } from 'src/queries/cloudpulse/alerts';
import { useRegionsQuery } from 'src/queries/regions/regions';
import { getErrorMap } from 'src/utilities/errorUtils';
import {
  handleFieldErrors,
  handleGeneralErrors,
} from 'src/utilities/formikErrorUtils';

export interface CreateAlertDefinitionDrawerProps {
  onClose: () => void;
  open: boolean;
}

const initialValues: CreateAlertDefinitionPayload = {
  alertSeverity: '',
  name: null,
  region: null,
  resources: [],
  service_type: '',
};

export const CreateAlertDefinitionDrawer = React.memo(
  (props: CreateAlertDefinitionDrawerProps) => {
    const { onClose, open } = props;
    const { mutateAsync } = useCreateAlertDefinition();
    const { enqueueSnackbar } = useSnackbar();
    const { data: regions } = useRegionsQuery();

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
    React.useEffect(() => {
      if (open) {
        resetForm();
      }
    }, [open, resetForm]);
    type Type = 'anomaly' | 'threshold';
    const [mode, setMode] = React.useState<Type>('threshold');

    const generalError = status?.generalError;
    return (
      <Drawer onClose={onClose} open={open} title="Create Alert Definition">
        <form onSubmit={handleSubmit}>
          {generalError && (
            <Notice
              data-qa-error
              key={status}
              text={status?.generalError ?? 'An unexpected error occurred'}
              variant="error"
            />
          )}
          <Box>Type</Box>
          <RadioGroup
            onChange={(_, value) => setMode(value as Type)}
            row
            value={mode}
          >
            <FormControlLabel
              control={<Radio />}
              label={'Static threshold'}
              value="threshold"
            />
            <FormControlLabel
              control={<Radio />}
              label={'Anomaly Detection'}
              value="anomaly"
            />
          </RadioGroup>
          <TextField
            inputProps={{
              autoFocus: true,
            }}
            errorText={errors.name}
            label="Name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
          />
          <TextField
            inputProps={{
              autoFocus: true,
            }}
            errorText={errors.description}
            label="Description"
            onBlur={handleBlur}
            onChange={handleChange}
            optional
            value={values.description}
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
          <Autocomplete
            options={[
              { label: 'Linodes', value: 'Linodes' },
              { label: 'ACLB', value: 'ACLB' },
            ]}
            inputMode="none"
            label={'Services'}
            placeholder="Select a service type"
          />
          <RegionSelect
            handleSelection={(value) => {
              setFieldValue('region', value);
            }}
            currentCapability={undefined}
            errorText={errors.region}
            label="Region"
            regions={regions ? regions : []}
            selectedId={values.region}
          />
          <Autocomplete
            options={[
              { label: 'Resource 1', value: 'Resource 1' },
              { label: 'Resource 2', value: 'Resource 2' },
              { label: 'Resource 3', value: 'Resource 3' },
              { label: 'Resource 4', value: 'Resource 4' },
            ]}
            label={'Resources'}
            multiple
            placeholder="Select the resources"
          />
          <Autocomplete
            options={[
              { label: '0', value: '0' },
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
            ]}
            label={'Alert severity'}
            textFieldProps={{ labelTooltipText: 'Alert Severity' }}
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
