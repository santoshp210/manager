import { Grid } from '@mui/material';
import { getIn, useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import {
  EvaluationPeriodOptions,
  PollingIntervalOptions,
  TriggerOptions,
} from '../../constants';

import type { ErrorUtilsProps } from '../CreateAlertDefinition';
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
  const formik = useFormikContext();
  const errors = getIn(formik.errors, name, {});
  const touched = getIn(formik.touched, name, {});
  const values = formik.getFieldProps(name).value;
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
      formik.setFieldValue(`${name}.${field}`, value);
    } else {
      formik.setFieldValue(`${name}.${field}`, '');
    }
  };
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
        marginTop: theme.spacing(2),
        p: 2,
      })}
    >
      <Typography variant="h3"> Trigger Conditions</Typography>
      <Grid alignItems="center" container spacing={2}>
        <Grid item md={3} sm={6} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${name}.evaluation_period_seconds`, true);
            }}
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
                'Choose the data lookback period on which thresholds are applied',
            }}
            data-testid="Evaluation-period"
            label={'Evaluation period'}
            options={getEvaluationPeriodOptions()}
            value={selectedEvaluationPeriod}
          />
        </Grid>
        <Grid item md={'auto'} sm={6} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${name}.polling_interval_seconds`, true);
            }}
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
            label={'Polling interval'}
            options={getPollingIntervalOptions()}
            value={selectedPollingInterval}
          />
        </Grid>
        <Grid item md={'auto'} sm={12} xs={12}>
          <Grid alignItems="center" container spacing={2}>
            <Grid item md={'auto'} sm={'auto'} xs={6}>
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                onBlur={(event) => {
                  formik.handleBlur(event);
                  formik.setFieldTouched(`${name}.criteria_condition`, true);
                }}
                onChange={(_, value, operation) => {
                  handleSelectChange(
                    'criteria_condition',
                    value?.value,
                    operation
                  );
                }}
                textFieldProps={{
                  labelTooltipText:
                    'AND implies alert is triggered when all the metrics criteria are met',
                }}
                value={
                  values?.criteria_condition
                    ? {
                        label: values.criteria_condition,
                        value: values.criteria_condition,
                      }
                    : null
                }
                data-testid="Trigger-alert-condition"
                label={'Trigger alert when'}
                options={TriggerOptions}
              />
            </Grid>
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
            <Grid item md={'auto'} sm={'auto'} xs={'auto'}>
              <TextField
                onWheel={(event) =>
                  event.target instanceof HTMLElement && event.target.blur()
                }
                sx={{
                  maxWidth: '80px',
                  minWidth: '70px',
                  paddingTop: { sm: '26px', xs: 0 },
                }}
                data-testid={'Trigger-occurences'}
                label={''}
                min={0}
                name={`${name}.trigger_occurrences`}
                noMarginTop={false}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={values?.trigger_occurrences ?? 0}
              />
            </Grid>
            <Grid item md={'auto'} sm={'auto'} xs={'auto'}>
              <Box sx={{ paddingTop: 1 }}>
                <Typography
                  sx={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    height: { sm: '56px', xs: '26px' },
                  }}
                  variant="body1"
                >
                  occurences.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={(theme) => ({ marginTop: theme.spacing(2) })}>
        <ErrorMessage
          errors={errors['evaluation_period_seconds']}
          touched={touched['evaluation_period_seconds']}
        />
        <ErrorMessage
          errors={errors['polling_interval_seconds']}
          touched={touched['polling_interval_seconds']}
        />
        <ErrorMessage
          errors={errors['criteria_condition']}
          touched={touched['criteria_condition']}
        />
        <ErrorMessage
          errors={errors['trigger_occurrences']}
          touched={touched['trigger_occurrences']}
        />
      </Box>
    </Box>
  );
});
