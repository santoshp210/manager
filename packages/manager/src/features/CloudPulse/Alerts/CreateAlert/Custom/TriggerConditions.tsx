import { getIn, useFormikContext } from 'formik';
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
  const handleSelectChange = (field: string, value: any, operation: string) => {
    if (operation === 'selectOption') {
      formik.setFieldValue(`${props.name}.${field}`, value);
    } else {
      formik.setFieldValue(`${props.name}.${field}`, '');
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
      <Stack direction={'row'} spacing={2}>
        <Autocomplete
          onChange={(_, value, operation) => {
            if (value !== null) {
              handleSelectChange('evaluationPeriod', value.value, operation);
              if (operation === 'selectOption') {
                setEvaluationPeriod(value.label);
              }
            }
          }}
          textFieldProps={{
            labelTooltipText:
              'Choose the data lookback period on which thresholds are applied',
          }}
          disableClearable={true}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={'Evaluation period'}
          options={EvaluationPeriodOptions}
          value={selectedEvaluationPeriod}
        />
        <Autocomplete
          onChange={(_, value, operation) => {
            if (value !== null) {
              handleSelectChange('evaluationInterval', value.value, operation);
              if (operation === 'selectOption') {
                setPollingInterval(value.label);
              }
            }
          }}
          textFieldProps={{
            labelTooltipText:
              'Choose how often you intend to evaulate the alert condition',
          }}
          disableClearable={true}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={'Polling interval'}
          options={getPollingIntervalOptions()}
          value={selectedPollingInterval}
        />
        <Autocomplete
          onChange={(_, value, operation) => {
            handleSelectChange('criteriaCondition', value?.value, operation);
          }}
          textFieldProps={{
            labelTooltipText:
              'AND implies alert is triggered when all the metrics criteria are met',
          }}
          value={
            values?.criteriaCondition
              ? {
                  label: values.criteriaCondition,
                  value: values.criteriaCondition,
                }
              : null
          }
          isOptionEqualToValue={(option, value) => option.label === value.label}
          label={'Trigger alert when'}
          options={TriggerOptions}
        />
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
        <TextField
          sx={{
            maxHeight: '32px',
            maxWidth: '90px',
            minWidth: '70px',
            paddingTop: '24px',
          }}
          label={''}
          min={0}
          name={`${props.name}.triggerOccurrence`}
          noMarginTop={false}
          onChange={formik.handleChange}
          type="number"
        />
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
      </Stack>
    </Box>
  );
});