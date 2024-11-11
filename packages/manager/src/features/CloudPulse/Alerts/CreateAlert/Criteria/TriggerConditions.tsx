import { Box } from '@linode/ui';
import { Grid } from '@mui/material';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import {
  EvaluationPeriodOptions,
  PollingIntervalOptions,
} from '../../constants';
interface TriggerConditionProps {
  /**
   * maximum scraping interval value for a metric to filter the evaluation period and polling interval options
   */
  maxScrapingInterval: number;
  /**
   * name used for the component to set formik field
   */
  name: string;
}
type IntervalOptions = {
  label: '';
  value: '';
};
export const TriggerConditions = React.memo((props: TriggerConditionProps) => {
  const [
    selectedEvaluationPeriod,
    setEvaluationPeriod,
  ] = React.useState<IntervalOptions | null>(null);
  const [
    selectedPollingInterval,
    setPollingInterval,
  ] = React.useState<IntervalOptions | null>(null);

  const { maxScrapingInterval, name } = props;

  const { control, setValue } = useFormContext();
  const getPollingIntervalOptions = () => {
    return PollingIntervalOptions.filter(
      (item) => parseInt(item.value, 10) >= maxScrapingInterval
    );
  };

  const getEvaluationPeriodOptions = () => {
    return EvaluationPeriodOptions.filter(
      (item) => parseInt(item.value, 10) >= maxScrapingInterval
    );
  };
  const handleSelectChange = (field: string, value: any, operation: string) => {
    if (operation === 'selectOption') {
      setValue(`${name}.${field}`, value);
    } else {
      setValue(`${name}.${field}`, '');
    }
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        marginTop: theme.spacing(2),
        p: 2,
      })}
    >
      <Typography variant="h3"> Trigger Conditions</Typography>
      <Grid alignItems="center" container spacing={2}>
        <Grid item md={3} sm={6} xs={12}>
          <Controller
            render={({ field, fieldState }) => (
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(_, value: IntervalOptions, operation) => {
                  handleSelectChange(
                    'evaluation_period_seconds',
                    value?.value ?? '',
                    operation
                  );
                  setEvaluationPeriod(value);
                }}
                textFieldProps={{
                  labelTooltipText:
                    'Defines the timeframe for collecting data in polling intervals to understand the service performance. Choose the data lookback period where the thresholds are applied to gather the information impactful for your business.',
                }}
                data-testid="Evaluation-period"
                errorText={fieldState.error?.message}
                label={'Evaluation period'}
                onBlur={field.onBlur}
                options={getEvaluationPeriodOptions()}
                placeholder="Select an Evaluation period"
                value={selectedEvaluationPeriod}
              />
            )}
            control={control}
            name={`${name}.evaluation_period_seconds`}
          />
        </Grid>
        <Grid item md={2.5} sm={6} xs={12}>
          <Controller
            render={({ field, fieldState }) => (
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(_, value: IntervalOptions, operation) => {
                  handleSelectChange(
                    'polling_interval_seconds',
                    value?.value ?? '',
                    operation
                  );
                  setPollingInterval(value);
                }}
                textFieldProps={{
                  labelTooltipText:
                    'Choose how often you intend to evaulate the alert condition',
                }}
                data-testid="Polling-interval"
                errorText={fieldState.error?.message}
                label={'Polling interval'}
                onBlur={field.onBlur}
                options={getPollingIntervalOptions()}
                placeholder="Select a Polling"
                value={selectedPollingInterval}
              />
            )}
            control={control}
            name={`${name}.polling_interval_seconds`}
          />
        </Grid>
        <Grid item md={'auto'} sm={12} xs={12}>
          <Grid alignItems="center" container spacing={2}>
            <Grid item md={'auto'} sm={6} xs={12}>
              <Box marginTop={1}>
                <Typography
                  sx={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    height: { sm: '56px', xs: '70px' },
                  }}
                  variant="body1"
                >
                  criteria are met for at least
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              md={3}
              sm={'auto'}
              sx={{ marginTop: { md: '27px' } }}
              xs={'auto'}
            >
              <Controller
                render={({ field, fieldState }) => (
                  <TextField
                    onWheel={(event) =>
                      event.target instanceof HTMLElement && event.target.blur()
                    }
                    sx={{
                      paddingTop: { sm: '26px', xs: 0 },
                      width: '30px',
                    }}
                    data-testid={'Trigger-occurences'}
                    errorText={fieldState.error?.message}
                    label={''}
                    min={0}
                    name={`${name}.trigger_occurrences`}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.target.value)}
                    type="number"
                    value={field.value ?? 0}
                  />
                )}
                control={control}
                name={`${name}.trigger_occurrences`}
              />
            </Grid>
            <Grid item md={'auto'} sm={'auto'} xs={'auto'}>
              <Box sx={{ marginTop: 1 }}>
                <Typography
                  sx={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    height: { sm: '56px', xs: '26px' },
                  }}
                  variant="body1"
                >
                  consecutive occurences.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});
