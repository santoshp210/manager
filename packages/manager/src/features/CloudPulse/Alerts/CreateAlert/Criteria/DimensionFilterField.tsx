import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import { Grid, styled } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';

import { DimensionOperatorOptions } from '../../constants';

import type { ErrorUtilsProps } from '../CreateAlertDefinition';
import type { Alert, Dimension } from '@linode/api-v4';

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
  const formik = useFormikContext<Alert>();
  // const [field, meta] = useField(name);
  // const values = field.value;
  // const error = meta.error;
  const dataFieldOptions = dimensionOptions.map((dimension) => ({
    label: dimension.label,
    value: dimension.dimension_label,
  }));

  const [
    selectedDataField,
    setSelectedDataField,
  ] = React.useState<DimensionDataFieldOption | null>(null);

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

  const handleDataFieldChange = (value: string, operation: string) => {
    const fieldValue = {
      dimension_label: '',
      operator: '',
      value: '',
    };
    if (operation === 'selectOption') {
      formik.setFieldValue(name, { ...fieldValue, dimension_label: value });
    } else {
      formik.setFieldValue(name, fieldValue);
    }
  };

  const errors = getIn(formik.errors, name, {});
  const touched = getIn(formik.touched, name, {});
  const values = formik.getFieldProps(name).value;

  const selectedDimension =
    dimensionOptions && values.dimension_label
      ? dimensionOptions.find(
          (dim) => dim.dimension_label === values.dimension_label
        )
      : null;

  const valueOptions =
    selectedDimension && selectedDimension.values
      ? selectedDimension.values.map((val) => ({ label: val, value: val }))
      : [];

  const ErrorMessage = ({ errors, touched }: ErrorUtilsProps) => {
    if (touched && errors) {
      return <Box sx={(theme) => ({ color: theme.color.red })}>{errors}</Box>;
    } else {
      return null;
    }
  };
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
              formik.setFieldTouched(`${name}.dimension_label`, true);
            }}
            onChange={(_, newValue, operation) => {
              handleDataFieldChange(newValue?.value ?? '', operation);
              setSelectedDataField(newValue);
            }}
            data-testid="Data-field"
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
              formik.setFieldTouched(`${name}.operator`, true);
            }}
            onChange={(_, newValue, operation) =>
              handleSelectChange('operator', newValue?.value ?? '', operation)
            }
            value={
              values.operator
                ? { label: values.operator, value: values.operator }
                : null
            }
            data-testid="Operator"
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
                  formik.setFieldTouched(`${name}.value`, true);
                }}
                onChange={(_, newValue, operation) =>
                  handleSelectChange('value', newValue?.value ?? '', operation)
                }
                value={
                  values?.value
                    ? { label: values.value, value: values.value }
                    : null
                }
                data-testid="Value"
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
        <ErrorMessage
          errors={errors['dimension_label']}
          touched={touched['dimension_label']}
        />
        <ErrorMessage
          errors={errors['operator']}
          touched={touched['operator']}
        />
        <ErrorMessage errors={errors['value']} touched={touched['value']} />
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
