import { ErrorMessage, getIn, useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import {
  EvaluationPeriodOptions,
  PollingIntervalOptions,
  TriggerOptions,
} from '../../constants';
import { Grid } from '@mui/material';
interface TriggerConditionProps {
  maxScrapingInterval: number;
  name: string;
}
export const TriggerConditions = React.memo((props: TriggerConditionProps) => {
  const [selectedEvaluationPeriod, setEvaluationPeriod] = React.useState<any>(
    ''
  );
  const [selectedPollingInterval, setPollingInterval] = React.useState<any>('');

  const formik = useFormikContext();
  const errors = getIn(formik.errors, props.name, {});
  const touchedFields = getIn(formik.touched, props.name, {});
  const values = formik.getFieldProps(props.name).value;

  const getPollingIntervalOptions = () => {
    return PollingIntervalOptions.filter(
      (item) => parseInt(item.value, 10) >= props.maxScrapingInterval
    );
  };

  const getEvaluationPeriodOptions = () => {
    return EvaluationPeriodOptions.filter(
      (item) => parseInt(item.value, 10) >= props.maxScrapingInterval
    );
  };
  const handleSelectChange = (field: string, value: any, operation: string) => {
    if (operation === 'selectOption') {
      formik.setFieldValue(`${props.name}.${field}`, value);
    } else {
      formik.setFieldValue(`${props.name}.${field}`, '');
    }
  };
  const CustomErrorMessage = (props: any) => (
    <Box sx={(theme) => ({ color: theme.color.red })}>{props.children}</Box>
  );
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
      {/* <Stack direction={'row'} spacing={2}>
        <Box>
          <Autocomplete
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(
                `${props.name}.evaluation_period_seconds`,
                true
              );
            }}
            onChange={(_, value, operation) => {
              if (value !== null) {
                handleSelectChange(
                  'evaluation_period_seconds',
                  value.value,
                  operation
                );
                if (operation === 'selectOption') {
                  setEvaluationPeriod(value.label);
                }
              }
            }}
            textFieldProps={{
              labelTooltipText:
                'Choose the data lookback period on which thresholds are applied',
            }}
            data-testid="Evaluation-period"
            disableClearable={true}
            isOptionEqualToValue={(option, value) => option.label === value}
            label={'Evaluation period'}
            options={getEvaluationPeriodOptions()}
            value={selectedEvaluationPeriod ? selectedEvaluationPeriod : null}
          />
        </Box>
        <Box>
          <Autocomplete
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(
                `${props.name}.polling_interval_seconds`,
                true
              );
            }}
            onChange={(_, value, operation) => {
              if (value !== null) {
                handleSelectChange(
                  'polling_interval_seconds',
                  value.value,
                  operation
                );
                if (operation === 'selectOption') {
                  setPollingInterval(value.label);
                }
              }
            }}
            textFieldProps={{
              labelTooltipText:
                'Choose how often you intend to evaulate the alert condition',
            }}
            data-testid="Polling-interval"
            disableClearable={true}
            isOptionEqualToValue={(option, value) => option.label === value}
            label={'Polling interval'}
            options={getPollingIntervalOptions()}
            value={selectedPollingInterval ? selectedPollingInterval : null}
          />
        </Box>
        <Box>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(`${props.name}.criteria_condition`, true);
            }}
            onChange={(_, value, operation) => {
              handleSelectChange('criteria_condition', value?.value, operation);
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
        </Box>
        <Box sx={{ paddingTop: '20px' }}>
          <Typography
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column-reverse',
              height: '56px',
            }}
            variant="body1"
          >
            criteria are met for at least
          </Typography>
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
              paddingTop: '24px',
            }}
            label={''}
            min={0}
            name={`${props.name}.trigger_occurences`}
            noMarginTop={false}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={values.trigger_occurences}
          />
        </Box>
        <Box sx={{ paddingTop: '20px' }}>
          <Typography
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column-reverse',
              height: '56px',
            }}
            variant="body1"
          >
            occurences.
          </Typography>
        </Box>
      </Stack> */}
      <Grid container spacing={2} alignItems="center">
         <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(
                `${props.name}.evaluation_period_seconds`,
                true
              );
            }}
            onChange={(_, value, operation) => {
              if (value !== null) {
                handleSelectChange(
                  'evaluation_period_seconds',
                  value.value,
                  operation
                );
                if (operation === 'selectOption') {
                  setEvaluationPeriod(value.label);
                }
              }
            }}
            textFieldProps={{
              labelTooltipText:
                'Choose the data lookback period on which thresholds are applied',
            }}
            data-testid="Evaluation-period"
            disableClearable={true}
            isOptionEqualToValue={(option, value) => option.label === value}
            label={'Evaluation period'}
            options={getEvaluationPeriodOptions()}
            value={selectedEvaluationPeriod ? selectedEvaluationPeriod : null}
          />
         </Grid>
         <Grid item xs={12} sm={6} md={'auto'}>
          <Autocomplete
            onBlur={(event) => {
              formik.handleBlur(event);
              formik.setFieldTouched(
                `${props.name}.polling_interval_seconds`,
                true
              );
            }}
            onChange={(_, value, operation) => {
              if (value !== null) {
                handleSelectChange(
                  'polling_interval_seconds',
                  value.value,
                  operation
                );
                if (operation === 'selectOption') {
                  setPollingInterval(value.label);
                }
              }
            }}
            textFieldProps={{
              labelTooltipText:
                'Choose how often you intend to evaulate the alert condition',
            }}
            data-testid="Polling-interval"
            disableClearable={true}
            isOptionEqualToValue={(option, value) => option.label === value}
            label={'Polling interval'}
            options={getPollingIntervalOptions()}
            value={selectedPollingInterval ? selectedPollingInterval : null}
          />
         </Grid>
         <Grid item xs={12} sm={12} md={'auto'}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} sm={'auto'} md={"auto"}>
              <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              onBlur={(event) => {
                formik.handleBlur(event);
                formik.setFieldTouched(`${props.name}.criteria_condition`, true);
              }}
              onChange={(_, value, operation) => {
                handleSelectChange('criteria_condition', value?.value, operation);
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
            <Grid item xs={6} sm={"auto"} md={"auto"}>
              <Box marginTop={1} >
                <Typography
                  sx={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    height: { sm: '56px', xs: '70px'},
                  }}
                  variant="body1"
                >
                  criteria are met for at least
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={'auto'} sm={"auto"} md={"auto"}>
              <TextField
                onWheel={(event) =>
                  event.target instanceof HTMLElement && event.target.blur()
                }
                sx={{
                  // maxHeight: '32px',
                  maxWidth: '80px',
                  minWidth: '70px',
                  paddingTop: { sm: '26px', xs: 0 },
                }}
                label={''}
                min={0}
                name={`${props.name}.trigger_occurences`}
                noMarginTop={false}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={values.trigger_occurences}
              />
            </Grid>
            <Grid item xs={'auto'} sm={"auto"} md={"auto"}>
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
        {touchedFields &&
        touchedFields.evaluation_period_seconds &&
        errors.evaluation_period_seconds ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.evaluation_period_seconds`}
          />
        ) : null}
        {touchedFields &&
        touchedFields.polling_interval_seconds &&
        errors.polling_interval_seconds ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.polling_interval_seconds`}
          />
        ) : null}
        {touchedFields &&
        touchedFields.criteria_condition &&
        errors.criteria_condition ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.criteria_condition`}
          />
        ) : null}
        {touchedFields &&
        touchedFields.Occurrence &&
        errors.trigger_occurences ? (
          <ErrorMessage
            component={CustomErrorMessage}
            name={`${props.name}.trigger_occurences`}
          />
        ) : null}
      </Box>
    </Box>
  );
});
