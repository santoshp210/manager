import { APIError } from '@linode/api-v4';
import { CreateAlertDefinitionPayload } from '@linode/api-v4/lib/cloudpulse/types';
import { createAlertDefinitionSchema }from '@linode/validation';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { Box } from 'src/components/Box';
import { Drawer } from 'src/components/Drawer';
import { Paper } from 'src/components/Paper';
import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
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
  name: null,
  region: null,
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

    const generalError = status?.generalError;
    return (
      <Drawer onClose={onClose} open={open} title="Create Alert Definition">
        <form>
          <Box>
            <Paper>Is this working ? </Paper>
          </Box>
          <RegionSelect
            handleSelection={(value) => {
              setFieldValue('region', value);
            }}
            currentCapability={undefined}
            regions={regions ? regions : []}
            selectedId={null}
          ></RegionSelect>
        </form>
      </Drawer>
    );
  }
);
