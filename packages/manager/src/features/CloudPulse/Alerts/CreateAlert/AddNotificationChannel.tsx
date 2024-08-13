import { notificationChannelSchema } from '@linode/validation';
import { Grid } from '@mui/material';
import { ErrorMessage, FormikProvider, setIn, useFormik } from 'formik';
import React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Chip } from 'src/components/Chip';
import { Typography } from 'src/components/Typography';

import { ChannelTypeOptions } from '../constants';
import { CustomChannelAutocomplete } from './Custom/CustomChannelAutocomplete';

interface AddNotificationChannelProps {
  onCancel: () => void;
  onClickAddNotification: (notifications: any) => void;
  templateData: any[];
}

export const AddNotificationChannel = (props: AddNotificationChannelProps) => {
  const [type, setType] = React.useState({ label: '', value: '' });
  const [disableValidation, setDisableValidation] = React.useState(false);
  const { onCancel, onClickAddNotification, templateData } = props;

  const formik = useFormik({
    initialValues: {
      templateName: '',
      type: '',
      values: {},
    },
    onSubmit: (values) => {
      onClickAddNotification(values);
    },
    validate: (values) => {
      if (disableValidation) {
        return {};
      }
      // Perform normal validation
      let errors = {};
      try {
        notificationChannelSchema.validateSync(values, { abortEarly: false });
      } catch (validationErrors) {
        validationErrors.inner.forEach((error: any) => {
          errors = setIn(errors, error.path, error.message);
        });
      }
      return errors;
    },
  });

  const selectedTypeTemplates =
    type && type.label
      ? templateData.filter((template) => template.type === type.value)
      : [];
  const templateOptions = selectedTypeTemplates
    ? selectedTypeTemplates.map((template) => ({
        label: template.templateName,
        value: template.templateName,
      }))
    : [];
  const selectedTemplate = selectedTypeTemplates.find(
    (template) => template.templateName === formik.values.templateName
  );

  const handleTemplateChange = (template: string) => {
    formik.setFieldValue('templateName', template);
  };

  const handleTypeChange = (value: any, operation: string) => {
    if (operation === 'selectOption') {
      formik.setFieldValue('type', value.label);
      formik.setFieldValue('values', { to: [] });
      setType(value);
    } else if (operation === 'clear') {
      formik.setFieldValue('type', '');
      formik.setFieldValue('values', {});
      setType({ label: '', value: '' });
    }
  };

  const handleEmailChange = (newEmailList: string[]) => {
    const newValue = { ...formik.values.values, to: newEmailList };
    formik.setFieldValue('values', newValue);
  };

  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );

  React.useEffect(() => {
    const isNewTemplate = !templateOptions.some(
      (obj) =>
        obj.label.toLocaleLowerCase() ===
        formik.values.templateName.toLocaleLowerCase()
    );
    if (!isNewTemplate && formik.values.templateName) {
      setDisableValidation(true);
    } else {
      setDisableValidation(false);
    }
  }, [formik.values.templateName]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
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
          <Box>
            <Autocomplete
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched('type', true);
              }}
              onChange={(_: any, newValue, operation) =>
                handleTypeChange(newValue, operation)
              }
              isOptionEqualToValue={(option) => option.label === type.label}
              label="Type"
              options={ChannelTypeOptions}
              value={type.label ? type : null}
            />
            {formik.touched && formik.touched.type && formik.errors.type ? (
              <ErrorMessage component={CustomErrorMessage} name="type" />
            ) : null}
          </Box>
          <Box>
            <CustomChannelAutocomplete
              handleBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched('templateName', true);
              }}
              label={'Channel'}
              onChange={handleTemplateChange}
              options={templateOptions}
              value={formik.values.templateName}
            />
            {formik.touched &&
            formik.touched.templateName &&
            formik.errors.templateName ? (
              <ErrorMessage
                component={CustomErrorMessage}
                name="templateName"
              />
            ) : null}
          </Box>
          {!disableValidation &&
            type &&
            type.value === 'Email' &&
            formik.values.templateName && (
              <Box>
                <Autocomplete
                  onBlur={(event) => {
                    formik.handleBlur(event);
                    formik.setFieldTouched('values.to', true);
                  }}
                  placeholder={
                    formik.values.values &&
                    formik.values.values['to'] &&
                    formik.values.values['to'].length > 0
                      ? ' '
                      : 'Enter Email'
                  }
                  disabled={false}
                  freeSolo
                  label="To"
                  multiple
                  onChange={(_: any, newValue) => handleEmailChange(newValue)}
                  options={[]}
                />
                {formik.touched.values &&
                formik.touched.values['to'] &&
                formik.errors.values &&
                formik.errors.values['to'] ? (
                  <ErrorMessage
                    component={CustomErrorMessage}
                    name="values.to"
                  />
                ) : null}
              </Box>
            )}
          {selectedTemplate && disableValidation && (
            <Box paddingTop={2}>
              <Grid container>
                <Grid item md={2}>
                  <Typography variant="h3">To:</Typography>
                </Grid>
                <Grid item md={10}>
                  {selectedTemplate.values &&
                    selectedTemplate.values.to.length > 0 &&
                    selectedTemplate.values.to.map(
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
    </FormikProvider>
  );
};
