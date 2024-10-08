import { createAlertDefinitionSchema } from '@linode/validation';
import { FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
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

import { AlertSeverityOptions } from './constants';

import type { APIError } from '@linode/api-v4';
import type { CreateAlertDefinitionPayload } from '@linode/api-v4/lib/cloudpulse/types';

export const initialValues: CreateAlertDefinitionPayload = {
  name: '',
  severity: '',
};

interface ErrorUtilsProps {
  errors: string | string[] | undefined;
  touched: boolean | undefined;
}
export const CreateAlertDefinition = React.memo(() => {
  const { mutateAsync } = useCreateAlertDefinition();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const alertCreateExit = () => {
    const pathParts = location.pathname.split('/');
    pathParts.pop();
    const previousPage = pathParts.join('/');
    history.push(previousPage);
  };
  const formik = useFormik({
    initialValues,
    onSubmit(
      values: CreateAlertDefinitionPayload,
      { resetForm, setErrors, setStatus, setSubmitting }
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
          resetForm();
          alertCreateExit();
        })
        .catch((err: APIError[]) => {
          const mapErrorToStatus = () =>
            setStatus({ generalError: getErrorMap([], err).none });
          setSubmitting(false);
          handleFieldErrors(setErrors, err);
          handleGeneralErrors(mapErrorToStatus, err, 'Error creating an alert');
        });
    },
    validationSchema: createAlertDefinitionSchema,
  });

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    status,
    touched,
    values,
  } = formik;

  const generalError = status?.generalError;

  const generateCrumbOverrides = (pathname: string) => {
    const pathParts = pathname.split('/').filter(Boolean);
    const lastTwoParts = pathParts.slice(-2);
    const fullPaths: string[] = [];

    pathParts.forEach((_, index) => {
      fullPaths.push('/' + pathParts.slice(0, index + 1).join('/'));
    });

    const overrides = lastTwoParts.map((part, index) => ({
      label: part,
      linkTo: fullPaths[pathParts.length - 2 + index],
      position: index + 1,
    }));

    return { newPathname: '/' + lastTwoParts.join('/'), overrides };
  };

  const { newPathname, overrides } = React.useMemo(
    () => generateCrumbOverrides(location.pathname),
    []
  );

  const ErrorMessage = ({ errors, touched }: ErrorUtilsProps) => {
    if (touched && errors) {
      return <Box sx={(theme) => ({ color: theme.color.red })}>{errors}</Box>;
    } else {
      return null;
    }
  };

  return (
    <Paper>
      <Breadcrumb
        crumbOverrides={overrides}
        pathname={newPathname}
      ></Breadcrumb>
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
            label="Name"
            name={'name'}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name ?? ''}
          />
          <ErrorMessage errors={errors['name']} touched={touched['name']} />
          <TextField
            label="Description"
            name={'description'}
            onBlur={handleBlur}
            onChange={handleChange}
            optional
            value={values.description ?? ''}
          />
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
          <ErrorMessage
            errors={errors['severity']}
            touched={touched['severity']}
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
              onClick: alertCreateExit,
            }}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          />
        </form>
      </FormikProvider>
    </Paper>
  );
});