import { DeleteOutlineOutlined } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';

const OperatorOptions = [
  {
    label: 'is',
    value: '=',
  },
  {
    label: 'contains',
    value: 'contains',
  },
];

export const DimensionFilterField = ({
  dimensionOptions,
  name,
  onFilterDelete,
}) => {
  const formik = useFormikContext();
  const [field, meta] = useField(name);

  const [dimension, setDimension] = React.useState<any>('');
  const selectedDimension = field.value.dim_label
    ? dimensionOptions.find((dim) => dim.label === field.value.dim_label)
    : null;
  const valueOptions =
    selectedDimension && selectedDimension.values
      ? selectedDimension.values.map((val) => ({ label: val, value: val }))
      : [];

  const handleSelectChange = (field, value, operation) => {
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}.${field}`, value.label);
      field === 'dim_label' && formik.setFieldValue(`${name}.value`, '');
    } else {
      formik.setFieldValue(`${name}.${field}`, '');
    }

    field === 'dim_label' && formik.setFieldValue(`${name}.value`, '');
  };

  return (
    <Stack direction="row" spacing={1}>
      <Autocomplete
        onChange={(event, newValue, operation) =>

          handleSelectChange('dim_label', newValue, operation)
        }
        value={
          field.value.dim_label
            ? { label: field.value.dim_label, value: field.value.dim_label }
            : null
        }
        isOptionEqualToValue={(option, value) => option.label === value?.label}
        label="Data Field"
        options={dimensionOptions}
      />
      <StyledOperatorAutocomplete
        onChange={(event, newValue, operation) =>
          handleSelectChange('operator', newValue, operation)
        }
        isOptionEqualToValue={(option, value) => option.label === value?.label}
        label={'Operator'}
        options={OperatorOptions}
        value={field.value.operator ? { label: field.value.operator } : null}
      />
      <Autocomplete
        onChange={(event, newValue, operation) =>
          handleSelectChange('value', newValue, operation)
        }
        value={
          field.value.value
            ? { label: field.value.value, value: field.value.value }
            : null
        }
        isOptionEqualToValue={(option, value) => option.label === value?.label}
        label="Value"
        options={valueOptions}
      />
      <Box>
        <StyledDeleteIcon onClick={onFilterDelete} />
      </Box>
    </Stack>
  );
};

const StyledOperatorAutocomplete = styled(Autocomplete, {
  label: 'StyledOperatorAutocomplete',
})({
  '& .MuiInputBase-root': {
    width: '90px',
  },
  minWidth: '90px',
  width: '90px',
});

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
