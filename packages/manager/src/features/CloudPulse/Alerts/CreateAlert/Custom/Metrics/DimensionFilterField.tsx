import { Dimension } from '@linode/api-v4';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Grid, styled } from '@mui/material';
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

  const selectedDimension = field.value.dimension_label
    ? dimensionOptions.find((dim) => dim.label === field.value.dimension_label)
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

    if (field === 'dimension_label') {
      formik.setFieldValue(`${name}.value`, '');
    }
  };
  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );
  return (
    <>
      {/* <Stack direction="row" spacing={2}>
        <Autocomplete
          isOptionEqualToValue={(option, value) =>
            option.label === value?.label
          }
          onBlur={(event) => {
            formik.handleBlur(event);
            formik.setFieldTouched(`${props.name}.dimension_label`, true);
          }}
          onChange={(event, newValue, operation) =>
            handleSelectChange('dimension_label', newValue, operation)
          }
          value={
            field.value.dimension_label
              ? {
                  label: field.value.dimension_label,
                  value: field.value.dimension_label,
                }
              : null
          }
          label="Data Field"
          options={valueOptions}
          sx={{ width: '25%' }}
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
      </Stack> */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3} md={3}> 
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value?.label
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${props.name}.dimension_label`, true);
            }}
            onChange={(event, newValue, operation) =>
              handleSelectChange('dimension_label', newValue, operation)
            }
            value={
              field.value.dimension_label
                ? {
                    label: field.value.dimension_label,
                    value: field.value.dimension_label,
                  }
                : null
            }
            label="Data Field"
            options={valueOptions}
            // sx={{ width: '25%' }}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={'auto'}> 
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
            // sx={{ width: '13%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}> 
          <Grid container spacing={0} alignItems="center">
            <Grid xs={10} sm={6} md={8}>
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
            />
            </Grid>
        
            <Grid sm={"auto"} paddingLeft={1}>
              <StyledDeleteIcon onClick={onFilterDelete} />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} sm={3} md={3}> 
          <Box>
            <StyledDeleteIcon onClick={onFilterDelete} />
          </Box>
        </Grid> */}
      </Grid>
      <Box>
        {meta.touched && meta.error && meta.error.dimension_label ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.dimension_label`}
          />
        ) : null}
        {meta.touched && meta.error && meta.error.operator ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.operator`}
          />
        ) : null}
        {meta.touched && meta.error && meta.error.value ? (
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
