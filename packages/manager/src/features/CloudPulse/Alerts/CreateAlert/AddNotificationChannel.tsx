
import { useFormik, ErrorMessage, FormikProvider } from "formik";
import React from "react";
import { ActionsPanel } from "src/components/ActionsPanel/ActionsPanel";
import { Autocomplete } from "src/components/Autocomplete/Autocomplete";
import { Box } from "src/components/Box";
import { Typography } from "src/components/Typography";

import { CustomChannelAutocomplete } from "./Custom/CustomChannelAutocomplete";
import { notificationChannelSchema } from "@linode/validation";


export const ChannelTypeOptions = [
  {
    label: 'Email',
    value: 'Email'
  },
];

interface AddNotificationChannelProps {
  onCancel: () => void;
  onClickAddNotification: (notifications : any) => void;
  options: any[];
};

export const AddNotificationChannel = (props: AddNotificationChannelProps) => {
  const [type, setType] = React.useState({label: "", value: ""});
  const {onCancel, onClickAddNotification, options} = props;
  const formik = useFormik({
    initialValues: {
      type: '',
      templateName: '',
      values: {}
    },
    validationSchema: notificationChannelSchema,
    onSubmit: (values) => {
      console.log(values);
      onClickAddNotification(values);
    },
  });

  const handleTemplateChange = (template: string) => {
    formik.setFieldValue('templateName', template);
  }

  const handleTypeChange = (value: any , operation: string) => {
 
    if(operation === 'selectOption') {
      formik.setFieldValue('type', value.label);
      formik.setFieldValue('values', { to: []});
      setType(value);
    }
    else if(operation === 'clear') {
      formik.setFieldValue('type', '');
      formik.setFieldValue('values', {});
      setType({label: "", value: ""});
    }
  }

  const handleEmailChange = (newEmailList : string[]) => {
    const newValue = {...formik.values.values, to:newEmailList}
    formik.setFieldValue('values', newValue);
  }

  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme ) => ({color: theme.color.red})}>{props.children}</Box>
  );

  return (<>
  <FormikProvider value={formik}>
    <form onSubmit={formik.handleSubmit}>
      <Box sx={(theme) => ({ p: 2, backgroundColor: theme.name === 'light' ? theme.color.grey5 : theme.color.grey9, borderRadius: 1 })}>
        <Typography variant="body2" gutterBottom sx={(theme) => ({ color: theme.color.black })}>
          Channel settings
        </Typography>
        <Box>
          <Autocomplete
            options={ChannelTypeOptions}
            label='Type'
            value={type.label ? type : null}
            onChange={(event, newValue, operation) => handleTypeChange(newValue, operation)}
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched('type', true);
            }}
            isOptionEqualToValue={(option) => option.label === type.label}
          />
          {formik.touched && formik.touched.type && formik.errors.type ? (
            <ErrorMessage name="type" component={CustomErrorMessage} />
          ) : null}
        </Box>
        <Box>
          <CustomChannelAutocomplete
            options= {options}
            value= {formik.values.templateName}
            label= {'Channel'}
            onChange= {handleTemplateChange}
          />
        </Box>
        {
          type && type.value === 'Email' && formik.values.templateName && 
            <Box>
              <Autocomplete 
                label="To"
                placeholder={(formik.values.values && formik.values.values['to'] && formik.values.values['to'].length > 0) ? " " : "Enter Email"}
                onChange={(_: any, newValue) => handleEmailChange(newValue)}
                options={[]}
                freeSolo
                multiple
                disabled={false}
                onBlur={(event) => {
                  formik.handleBlur(event);
                  formik.setFieldTouched('values.to', true);
                }}
              />
              {formik.touched.values && formik.touched.values["to"] && formik.errors.values && formik.errors.values["to"] ? (
                <ErrorMessage name="values.to" component={CustomErrorMessage} />
              ) : null}
            </Box>
        }
        
      </Box>
      <ActionsPanel secondaryButtonProps={{
        label: 'Cancel',
        onClick: onCancel
      }} primaryButtonProps={{
        label: 'Add channel',
        type: 'submit'
      }}
      />
    </form>
    </FormikProvider>
  </>)
}