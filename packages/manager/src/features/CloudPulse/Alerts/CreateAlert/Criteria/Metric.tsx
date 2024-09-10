import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import { Grid, styled } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import { MetricOperatorOptions } from '../../constants';
import { DimensionFilter } from './DimensionFilter';

import type { ErrorUtilsProps } from '../CreateAlertDefinition';
import type { AvailableMetrics } from '@linode/api-v4';

interface MetricCriteriaProps {
  /**
   * apiErrors while accessing the metric definitions endpoint
   */
  apiError: boolean[];
  /**
   * metric data fetched by the metric definitions endpoint
   */
  data: AvailableMetrics[];
  /**
   * name (with the index) used for the component to set formik field
   */
  name: string;
  /**
   * function to delete the Metric component
   * @returns void
   */
  onMetricDelete: () => void;
}
type MetricDataFieldOption = {
  label: '';
  value: '';
};
export const Metric = (props: MetricCriteriaProps) => {
  const { apiError, data, name, onMetricDelete } = props;
  const [isMetricDefinitionError, isMetricDefinitionLoading] = apiError;
  const formik = useFormikContext();

  const [
    selectedMetricField,
    setMetric,
  ] = React.useState<MetricDataFieldOption | null>(null);

  const handleSelectChange = (
    field: any,
    value: number | string,
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
      aggregation_type: '',
      dimension_filters: [],
      metric: '',
      operator: '',
      value: 0,
    };
    if (operation === 'selectOption') {
      formik.setFieldValue(name, { ...fieldValue, metric: value });
    } else {
      formik.setFieldValue(name, fieldValue);
    }
  };

  const errors = getIn(formik.errors, name, {});
  const touched = getIn(formik.touched, name, {});
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
  const ErrorMessage = ({ errors, touched }: ErrorUtilsProps) => {
    if (touched && errors) {
      return <Box sx={(theme) => ({ color: theme.color.red })}>{errors}</Box>;
    } else {
      return null;
    }
  };
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
        <Grid alignItems="center" container spacing={2}>
          <Grid item md={3} sm={6} xs={12}>
            <Autocomplete
              errorText={
                isMetricDefinitionError ? 'Error in fetching the data' : ''
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${name}.metric`, true);
              }}
              onChange={(_, newValue: MetricDataFieldOption, operation) => {
                handleDataFieldChange(newValue?.value ?? '', operation);
                setMetric(newValue);
              }}
              textFieldProps={{
                labelTooltipText:
                  'Choose the metric that you intend to alert upon',
              }}
              data-testid={'Data-field'}
              label="Data Field"
              loading={isMetricDefinitionLoading}
              loadingText={'Loading the data fields'}
              options={metricOptions}
              size="medium"
              value={selectedMetricField}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${name}.aggregation_type`, true);
              }}
              onChange={(event, newValue, operation) =>
                handleSelectChange(
                  'aggregation_type',
                  newValue?.value ?? '',
                  operation
                )
              }
              value={
                values?.aggregation_type
                  ? {
                      label: values.aggregation_type,
                      value: values.aggregation_type,
                    }
                  : null
              }
              data-testid={'Aggregation-type'}
              key={values.metric}
              label="Aggregation type"
              options={aggOptions}
              sx={{ paddingTop: { sm: 1, xs: 0 } }}
            />
          </Grid>
          <Grid item md={'auto'} sm={6} xs={12}>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.label === value?.label
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${name}.operator`, true);
              }}
              onChange={(event, newValue, operation) =>
                handleSelectChange('operator', newValue?.value ?? '', operation)
              }
              value={
                values.operator
                  ? { label: values.operator, value: values.operator }
                  : null
              }
              data-testid={'Operator'}
              key={values.metric}
              label={'Operator'}
              options={MetricOperatorOptions}
              sx={{ paddingTop: { sm: 1, xs: 0 } }}
            />
          </Grid>
          <Grid item marginTop={{ sm: 1, xs: 0 }} md={'auto'} sm={6} xs={12}>
            <Grid alignItems="center" container spacing={2}>
              <Grid item md={'auto'} sm={6} xs={6}>
                <TextField
                  onWheel={(event) =>
                    event.target instanceof HTMLElement && event.target.blur()
                  }
                  label="Value"
                  min={0}
                  name={`${name}.value`}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={values.value}
                />
              </Grid>
              <Grid item md={'auto'} sm={6} xs={6}>
                <Typography
                  sx={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    height: '56px',
                  }}
                  variant="body1"
                >
                  {unit}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box sx={(theme) => ({ marginTop: theme.spacing(1) })}>
          <ErrorMessage errors={errors['metric']} touched={touched['metric']} />
          <ErrorMessage
            errors={errors['aggregation_type']}
            touched={touched['aggregation_type']}
          />
          <ErrorMessage
            errors={errors['operator']}
            touched={touched['operator']}
          />
          <ErrorMessage errors={errors['value']} touched={touched['value']} />
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
