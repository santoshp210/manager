import { notificationChannelSchema } from '@linode/validation';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Typography } from 'src/components/Typography';

import { CustomChannelAutocomplete } from './Custom/CustomChannelAutocomplete';

export const ChannelTypeOptions = [
  {
    label: 'Email',
    value: 'Email',
  },
];

interface AddNotificationChannelProps {
  onCancel: () => void;
  onClickAddNotification: (notifications: any) => void;
  options: any[];
}

export const AddNotificationChannel = (props: AddNotificationChannelProps) => {
  const [type, setType] = React.useState({ label: '', value: '' });
  const { onCancel, onClickAddNotification, options } = props;
  const formik = useFormik({
    initialValues: {
      templateName: '',
      type: '',
      values: {},
    },
    onSubmit: (values) => {
      onClickAddNotification(values);
    },
    validationSchema: notificationChannelSchema,
  });

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
              onChange={(event, newValue, operation) =>
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
              label={'Channel'}
              onChange={handleTemplateChange}
              options={options}
              value={formik.values.templateName}
            />
          </Box>
          {type && type.value === 'Email' && formik.values.templateName && (
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
                <ErrorMessage component={CustomErrorMessage} name="values.to" />
              ) : null}
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
