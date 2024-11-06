import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import { Grid, styled } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import { MetricOperatorOptions } from '../../constants';
import { DimensionFilter } from './DimensionFilter';

import type { AvailableMetrics } from '@linode/api-v4';
import type { Control, FieldValues } from 'react-hook-form';
import { Box } from '@linode/ui/src/components/Box';

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
   * name (with the index) used for the component to set in form
   */
  name: string;
  /**
   * function to delete the Metric component
   * @returns void
   */
  onMetricDelete: () => void;
}
type MetricDataFieldOption = {
  label: string;
  value: string;
};

export const Metric = (props: MetricCriteriaProps) => {
  const { apiError, data, name, onMetricDelete } = props;
  const [isMetricDefinitionError, isMetricDefinitionLoading] = apiError;
  const { control, setValue, watch } = useFormContext();

  const [
    selectedMetricField,
    setMetric,
  ] = React.useState<MetricDataFieldOption | null>(null);

  const handleSelectChange = (
    field: string,
    value: number | string,
    operation: string
  ) => {
    if (operation === 'selectOption') {
      setValue(`${name}.${field}`, value);
    } else {
      setValue(`${name}.${field}`, '');
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
      setValue(name, { ...fieldValue, metric: value });
    } else {
      setValue(name, fieldValue);
    }
  };

  const metricOptions = data
    ? data.map((metric) => ({ label: metric.label, value: metric.metric }))
    : [];

  const metricWatcher = watch(`${name}.metric`);
  const selectedMetric =
    data && metricWatcher
      ? data.find((metric) => metric.metric === metricWatcher)
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
            <Controller
              render={({ field, fieldState}) => (
                <Autocomplete
                  errorText={
                    fieldState.error?.message ?? isMetricDefinitionError ? 'Error in fetching the data' : ''
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
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
                  onBlur={field.onBlur}
                  options={metricOptions}
                  size="medium"
                  value={selectedMetricField}
                />
              )}
              control={control}
              name={`${name}.metric`}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <Controller
              render={({ field, fieldState }) => (
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    option.value === value || value === ''
                  }
                  onChange={(_, newValue, operation) =>
                    handleSelectChange(
                      'aggregation_type',
                      newValue?.value,
                      operation
                    )
                  }
                  data-testid={'Aggregation-type'}
                  key={metricWatcher}
                  label="Aggregation type"
                  onBlur={field.onBlur}
                  options={aggOptions}
                  errorText={fieldState.error?.message}
                  sx={{ paddingTop: { sm: 1, xs: 0 } }}
                  value={field.value !== '' ? field.value : null}
                />
              )}
              control={control}
              name={`${name}.aggregation_type`}
            />
          </Grid>
          <Grid item md={'auto'} sm={6} xs={12}>
            <Controller
              render={({ field, fieldState }) => (
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    option.label === value
                  }
                  onChange={(_, newValue, operation) =>
                    handleSelectChange('operator', newValue?.value, operation)
                  }
                  errorText={fieldState.error?.message}
                  data-testid={'Operator'}
                  key={metricWatcher}
                  label={'Operator'}
                  onBlur={field.onBlur}
                  options={MetricOperatorOptions}
                  sx={{ paddingTop: { sm: 1, xs: 0 } }}
                  value={field.value !== '' ? field.value : null}
                />
              )}
              control={control}
              name={`${name}.operator`}
            />
          </Grid>
          <Grid item marginTop={{ sm: 1, xs: 0 }} md={'auto'} sm={6} xs={12}>
            <Grid alignItems="center" container spacing={2}>
              <Grid item md={'auto'} sm={6} xs={6}>
                <Controller
                  render={({ field, fieldState}) => (
                    <TextField
                      onWheel={(event) =>
                        event.target instanceof HTMLElement &&
                        event.target.blur()
                      }
                      label="Value"
                      min={0}
                      name={`${name}.value`}
                      onBlur={field.onBlur}
                      errorText={fieldState.error?.message}
                      onChange={(e) => field.onChange(e.target.value)}
                      type="number"
                      value={field.value ?? 0}
                    />
                  )}
                  control={control}
                  name={`${name}.value`}
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
