import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import { Grid, styled } from '@mui/material';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';

import { DimensionOperatorOptions } from '../../constants';

import type { Dimension } from '@linode/api-v4';

interface DimensionFilterFieldProps {
  /**
   * dimension filter data options to list in the Autocomplete component
   */
  dimensionOptions: Dimension[];
  /**
   * name (with the index) used for the component to set formik field
   */
  name: string;
  /**
   * function to delete the DimensionFilter component
   * @returns void
   */
  onFilterDelete: () => void;
}
type DimensionDataFieldOption = {
  label: string;
  value: string;
};
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

  const handleSelectChange = (
    field: string,
    value: string,
    operation: string
  ) => {
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}.${field}`, value);
    } else {
      formik.setFieldValue(`${name}.${field}`, '');
    }
  };

  const [
    selectedDataField,
    setSelectedDataField,
  ] = React.useState<DimensionDataFieldOption | null>(null);
  const handleDataFieldChange = (
    field: string,
    value: string,
    operation: string
  ) => {
    const fieldValue = {
      dimension_label: '',
      operator: '',
      value: '',
    };
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}.${field}`, value);
    } else {
      formik.setFieldValue(`${name}`, fieldValue);
    }
  };

  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );
  return (
    <>
      <Grid alignItems="center" container spacing={2}>
        <Grid item md={3} sm={3} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${props.name}.dimension_label`, true);
            }}
            onChange={(event, newValue, operation) => {
              handleDataFieldChange(
                'dimension_label',
                newValue?.value ?? '',
                operation
              );
              setSelectedDataField(newValue);
            }}
            label="Data Field"
            options={dataFieldOptions}
            value={selectedDataField}
          />
        </Grid>
        <Grid item md={'auto'} sm={3} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value?.label
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${props.name}.operator`, true);
            }}
            onChange={(event, newValue, operation) =>
              handleSelectChange('operator', newValue?.value ?? '', operation)
            }
            value={
              field.value.operator
                ? { label: field.value.operator, value: field.value.operator }
                : null
            }
            label={'Operator'}
            options={DimensionOperatorOptions}
          />
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Grid alignItems="center" container spacing={0}>
            <Grid item md={8} sm={6} xs={10}>
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  option.label === value?.label
                }
                onBlur={(event) => {
                  formik.handleBlur(event);
                  formik.setFieldTouched(`${props.name}.value`, true);
                }}
                onChange={(event, newValue, operation) =>
                  handleSelectChange('value', newValue?.value ?? '', operation)
                }
                value={
                  field.value.value
                    ? { label: field.value.value, value: field.value.value }
                    : null
                }
                label="Value"
                options={valueOptions}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item paddingLeft={1} sm={'auto'}>
          <StyledDeleteIcon onClick={onFilterDelete} />
        </Grid>
      </Grid>
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
