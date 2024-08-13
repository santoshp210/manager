import { AvailableMetrics } from '@linode/api-v4';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { styled } from '@mui/material';
import { ErrorMessage, getIn, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import { MetricOperatorOptions } from '../../../constants';
import { DimensionFilter } from './DimensionFilter';

interface MetricProps {
  apiError: boolean[];
  data: AvailableMetrics[];
  name: string;
  onMetricDelete: () => void;
}

export const Metric = (props: MetricProps) => {
  const { apiError, data, name, onMetricDelete } = props;
  const [isMetricDefinitionError, isMetricDefinitionLoading] = apiError;
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
      aggregation_type: '',
      dimension_filters: [],
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
  const metricOptions = data
    ? data.map((metric) => ({ label: metric.label, value: metric.metric }))
    : [];

  const selectedMetric =
    data && values.metric
      ? data.find((metric) => metric.metric === values.metric)
      : null;

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
  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );
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
        <Stack direction="row" spacing={3}>
          <Box>
            <Autocomplete
              errorText={
                isMetricDefinitionError ? 'Error in fetching the data' : ''
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${name}.metric`, true);
              }}
              onChange={(event, newValue, operation) => {
                handleDataFieldChange('metric', newValue, operation);
                setMetric(newValue.label);
              }}
              textFieldProps={{
                labelTooltipText:
                  'Choose the metric that you intend to alert upon',
              }}
              disableClearable={true}
              isOptionEqualToValue={(option, value) => option.label === value}
              label="Data Field"
              loading={isMetricDefinitionLoading}
              loadingText={'Loading the data fields'}
              options={metricOptions}
              size="medium"
              value={selectedMetricField ? selectedMetricField : null}
            />
          </Box>
          <Box>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${name}.aggregation_type`, true);
              }}
              onChange={(event, newValue, operation) =>
                handleSelectChange('aggregation_type', newValue, operation)
              }
              value={
                values?.aggregation_type
                  ? {
                      label: values.aggregation_type,
                      value: values.aggregation_type,
                    }
                  : null
              }
              label="Aggregation type"
              options={aggOptions}
              sx={{ paddingTop: '7px' }}
            />
          </Box>
          <Box>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.label === value?.label
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${name}.operator`, true);
              }}
              onChange={(event, newValue, operation) =>
                handleSelectChange('operator', newValue, operation)
              }
              value={
                values.operator
                  ? { label: values.operator, value: values.operator }
                  : null
              }
              label={'Operator'}
              options={MetricOperatorOptions}
              sx={{ paddingTop: '7px' }}
            />
          </Box>
          <Box>
            <TextField
              onWheel={(event) =>
                event.target instanceof HTMLElement && event.target.blur()
              }
              sx={{
                maxHeight: '32px',
                maxWidth: '90px',
                minWidth: '70px',
                paddingTop: '7px',
              }}
              label="Value"
              min={0}
              name={`${name}.value`}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              value={values.value}
            />
          </Box>

          <Box paddingTop={'19px'}>
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
        <Box sx={(theme) => ({ marginTop: theme.spacing(1) })}>
          {touchedFields && touchedFields.metric && errors.metric ? (
            <ErrorMessage
              component={CustomErrorMessage}
              name={`${props.name}.metric`}
            />
          ) : null}
          {touchedFields &&
          touchedFields.aggregation_type &&
          errors.aggregation_type ? (
            <ErrorMessage
              component={CustomErrorMessage}
              name={`${props.name}.aggregation_type`}
            />
          ) : null}
          {touchedFields && touchedFields.operator && errors.operator ? (
            <ErrorMessage
              component={CustomErrorMessage}
              name={`${props.name}.operator`}
            />
          ) : null}
          {touchedFields && touchedFields.value && errors.value ? (
            <ErrorMessage
              component={CustomErrorMessage}
              name={`${props.name}.value`}
            />
          ) : null}
        </Box>
        <DimensionFilter
          dimensionOptions={dimensionOptions}
          name={`${name}.dimension_filters`}
        />
      </Stack>
    </Box>
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
  padding: 0,
}));
