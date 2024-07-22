/* eslint-disable no-console */
import { AvailableMetrics, MetricDefinitions } from '@linode/api-v4';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Grid, IconButton, styled } from '@mui/material';
import { getIn, useField, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { FormControl } from 'src/components/FormControl';
import { FormHelperText } from 'src/components/FormHelperText';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import { OperatorOptions } from '../../../constants';
import { DimensionFilter } from './DimensionFilter';

// const OperatorOptions = [
//   {
//     label: '>',
//     value: '>',
//   },
//   {
//     label: '<',
//     value: '<',
//   },
//   {
//     label: '>=',
//     value: '>=',
//   },
//   {
//     label: '<=',
//     value: '>=',
//   },
//   {
//     label: '==',
//     value: '==',
//   },
// ];

interface MetricProps {
  data: AvailableMetrics;
  //   getScrapeInterval?: (interval: string) => void;
  name: string;
  onMetricDelete: () => void;
}

export const Metric = (props: MetricProps) => {
  const { data, name, onMetricDelete } = props;
  const formik = useFormikContext();

  const [selectedMetricField, setMetric] = React.useState<any>('');

  const handleSelectChange = (field: any, value: any, operation: string) => {
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}.${field}`, value.value);
    } else {
      formik.setFieldValue(`${name}.${field}`, '');
    }
  };

  const handleDataFieldChange = (field: any, value: any, operation: string) => {
    const fieldValue = {
      aggregationType: '',
      filters: [],
      metric: '',
      operator: '',
      value: 0,
    };
    if (operation === 'selectOption') {
      formik.setFieldValue(`${name}`, { ...fieldValue, metric: value.value });
    } else {
      formik.setFieldValue(`${name}`, fieldValue);
    }
  };

  const errors = getIn(formik.errors, name, {});
  const touchedFields = getIn(formik.touched, name, {});
  const values = formik.getFieldProps(name).value;
  // eslint-disable-next-line no-console
  const metricOptions = data
    ? data.map((metric) => ({ label: metric.label, value: metric.metric }))
    : [];

  const selectedMetric =
    data && values.metric
      ? data.find((metric) => metric.metric === values.metric)
      : null;

  //   props.getScrapeInterval(selectedMetric.scrape_interval);
  //   console.log(selectedMetric);
  const aggOptions =
    selectedMetric && selectedMetric.available_aggregate_functions
      ? selectedMetric.available_aggregate_functions.map((fn) => ({
          label: fn,
          value: fn,
        }))
      : [];
  const dimensionOptions =
    selectedMetric && selectedMetric.dimensions
      ? selectedMetric.dimensions
      : [];

  const unit = selectedMetric ? selectedMetric.unit : '%';
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 2,
      })}
    >
      <Stack>
        <Box display={'flex'} justifyContent="space-between">
          <Typography variant={'h3'}>Metric</Typography>
          <Box>
            <StyledDeleteIcon onClick={onMetricDelete} />
          </Box>
        </Box>
        <Stack direction="row" spacing={2}>
          {/* <FormControl fullWidth margin="normal" sx={{ marginTop: 0 }}> */}
          <Autocomplete
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${name}.metric`, true);
            }}
            onChange={(event, newValue, operation) => {
              handleDataFieldChange('metric', newValue, operation);
              setMetric(newValue.label);
            }}
            isOptionEqualToValue={(option, value) => option.label === value}
            label="Data Field"
            options={metricOptions}
            size="medium"
            sx={{ width: '25%' }}
            value={selectedMetricField}
          />

          {/* {touchedFields && errors && touchedFields.metric && errors.metric && (
              <FormHelperText
                sx={(theme) => ({
                  marginLeft: 0,
                  marginTop: theme.spacing(1),
                })}
              >
                {getIn(formik.errors, `${name}.metric`).toString()}
              </FormHelperText>
            )}
          </FormControl> */}
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value?.value
            }
            onChange={(event, newValue, operation) =>
              handleSelectChange('aggregationType', newValue, operation)
            }
            value={
              values?.aggregationType
                ? {
                    label: values.aggregationType,
                    value: values.aggregationType,
                  }
                : null
            }
            label="Aggregation type"
            options={aggOptions}
            sx={{ width: '15%' }}
          />
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value?.label
            }
            onChange={(event, newValue, operation) =>
              handleSelectChange('operator', newValue, operation)
            }
            value={
              values.operator
                ? { label: values.operator, value: values.operator }
                : null
            }
            label={'Operator'}
            options={OperatorOptions}
            sx={{ width: '13%' }}
          />
          <TextField
            error={touchedFields.value && Boolean(errors.value)}
            label="Value"
            min={0}
            name={`${name}.value`}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            sx={{ maxHeight: '32px', maxWidth: '90px', minWidth: '70px' }}
            type="number"
            value={values.value}
          />
          <Box paddingTop={'12px'}>
            <Typography
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column-reverse',
                height: '56px',
              }}
              variant="body1"
            >
              {unit}
            </Typography>
          </Box>
        </Stack>
        <DimensionFilter
          dimensionOptions={dimensionOptions}
          name={`${name}.filters`}
        />
      </Stack>
    </Box>
  );
};

// const StyledOperatorAutocomplete = styled(Autocomplete, {
//   label: 'StyledOperatorAutocomplete',
// })({
//   '& .MuiInputBase-root': {
//     width: '80px',
//   },
//   minWidth: '80px',
//   width: '80px',
// });

const StyledDeleteIcon = styled(DeleteOutlineOutlined)(({ theme }) => ({
  '&:active': {
    transform: 'scale(0.9)',
  },
  '&:hover': {
    color: theme.color.blue,
  },
  color: theme.palette.text.primary,
  cursor: 'pointer',
  padding: 0,
}));
