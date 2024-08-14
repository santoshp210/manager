import { Dimension } from '@linode/api-v4';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { styled } from '@mui/material';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';

import { DimensionOperatorOptions } from '../../../constants';

interface DimensionFilterFieldProps {
  dimensionOptions: Dimension[];
  name: string;
  onFilterDelete: () => void;
}
export const DimensionFilterField = (props: DimensionFilterFieldProps) => {
  const { dimensionOptions, name, onFilterDelete } = props;
  const formik = useFormikContext();
  const [field, meta] = useField(name);
  const error: any = meta.error;
  const dataFieldOptions = dimensionOptions.map((dimension) => ({
    label: dimension.label,
    value: dimension.dim_label,
  }));
  const selectedDimension = field.value.dimension_label
    ? dimensionOptions.find(
        (dim) => dim.dim_label === field.value.dimension_label
      )
    : null;

  const valueOptions =
    selectedDimension && selectedDimension.values
      ? selectedDimension.values.map((val) => ({ label: val, value: val }))
      : [];

  const handleSelectChange = (field: string, value: any, operation: string) => {
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}.${field}`, value.label);
    } else {
      formik.setFieldValue(`${name}.${field}`, '');
    }
  };

  const handleDataFieldChange = (field: any, value: any, operation: string) => {
    const fieldValue = {
      dimension_label: '',
      operator: '',
      value: '',
    };
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}.${field}`, value.value);
      setSelectedDataField(value);
    } else {
      formik.setFieldValue(`${name}`, fieldValue);
      setSelectedDataField({ label: '', value: '' });
    }
  };

  const [selectedDataField, setSelectedDataField] = React.useState({
    label: '',
    value: '',
  });
  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          onBlur={(event) => {
            formik.handleBlur(event);
            formik.setFieldTouched(`${props.name}.dimension_label`, true);
          }}
          onChange={(event, newValue, operation) => {
            handleDataFieldChange('dimension_label', newValue, operation);
          }}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          label="Data Field"
          options={dataFieldOptions}
          sx={{ width: '25%' }}
          value={selectedDataField.label ? selectedDataField : null}
        />

        <Autocomplete
          isOptionEqualToValue={(option, value) =>
            option.label === value?.label
          }
          onBlur={(event) => {
            formik.handleBlur(event);
            formik.setFieldTouched(`${props.name}.operator`, true);
          }}
          onChange={(event, newValue, operation) =>
            handleSelectChange('operator', newValue, operation)
          }
          value={
            field.value.operator
              ? { label: field.value.operator, value: field.value.operator }
              : null
          }
          label={'Operator'}
          options={DimensionOperatorOptions}
          sx={{ width: '13%' }}
        />

        <Autocomplete
          isOptionEqualToValue={(option, value) =>
            option.label === value?.label
          }
          onBlur={(event) => {
            formik.handleBlur(event);
            formik.setFieldTouched(`${props.name}.value`, true);
          }}
          onChange={(event, newValue, operation) =>
            handleSelectChange('value', newValue, operation)
          }
          value={
            field.value.value
              ? { label: field.value.value, value: field.value.value }
              : null
          }
          label="Value"
          options={valueOptions}
          sx={{ width: '15%' }}
        />
        <Box>
          <StyledDeleteIcon onClick={onFilterDelete} />
        </Box>
      </Stack>
      <Box>
        {meta.touched && error && error.dimension_label ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.dimension_label`}
          />
        ) : null}
        {meta.touched && error && error.operator ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.operator`}
          />
        ) : null}
        {meta.touched && error && error.value ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.value`}
          />
        ) : null}
      </Box>
    </>
  );
};

const StyledDeleteIcon = styled(DeleteOutlineOutlined)(({ theme }) => ({
  '&:active': {
    transform: 'scale(0.9)',
  },
  '&:hover': {
    color: theme.color.blue,
  },
  color: theme.palette.text.primary,
  cursor: 'pointer',
  marginTop: '45px',
  padding: 0,
}));
