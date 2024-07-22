import { getIn, useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';

import {
  EvaluationIntervalOptions,
  EvaluationPeriodOptions,
  TriggerOptions,
} from '../../constants';

// interface TriggerCondition {
//   criteriaCondition: string;
//   evaluationInterval: string;
//   evaluationPeriod: string;
//   triggerOccurrence: string;
// }

interface TriggerConditionProps {
  // handleConditionChange: (value: any) => void;
  name: string;
  // scrapingInterval: string;
}
export const TriggerConditions = React.memo((props: TriggerConditionProps) => {
  // const [
  //   selectedCondition,
  //   setSelectedCondition,
  // ] = React.useState<TriggerCondition>();

  const formik = useFormikContext();
  const errors = getIn(formik.errors, props.name, {});
  const touchedFields = getIn(formik.touched, props.name, {});
  const values = formik.getFieldProps(props.name).value;

  // const changeConditionValues = (value: any, field: string) => {
  //   if (!value) {
  //     return;
  //   }
  //   const tempCondition = value && { ...selectedCondition, [field]: value };
  //   setSelectedCondition(tempCondition);
  // };

  const handleSelectChange = (field: string, value: any, operation: string) => {
    if (operation === 'selectOption') {
      // eslint-disable-next-line no-console
      console.log(value, field, props.name);
      formik.setFieldValue(`${props.name}.${field}`, value);
    } else {
      formik.setFieldValue(`${props.name}.${field}`, '');
    }
  };
  // React.useEffect(() => {
  //   props.handleConditionChange(selectedCondition);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedCondition]);

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        borderRadius: 1,
        p: 2,
      })}
    >
      <Typography variant="h3"> Trigger Conditions</Typography>
      <Stack direction={'row'} spacing={2}>
        <Autocomplete
          onChange={(_, value, operation) => {
            handleSelectChange('evaluationPeriod', value?.value, operation);
          }}
          value={
            values?.evaluationPeriod
              ? {
                  label: values.evaluationPeriod,
                  value: values.evaluationPeriod,
                }
              : null
          }
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={'Evaluation period'}
          options={EvaluationPeriodOptions}
          textFieldProps={{ labelTooltipText: 'Evaluation period' }}
        />
        <Autocomplete
          onChange={(_, value, operation) => {
            handleSelectChange('evaluationInterval', value?.value, operation);
          }}
          value={
            values?.evaluationInterval
              ? {
                  label: values.evaluationInterval,
                  value: values.evaluationInterval,
                }
              : null
          }
          isOptionEqualToValue={(option, value) => option.value === value.value}
          label={'Polling interval'}
          options={EvaluationIntervalOptions}
          textFieldProps={{ labelTooltipText: 'Polling interval' }}
        />
        <Autocomplete
          onChange={(_, value, operation) => {
            handleSelectChange('criteriaCondition', value?.value, operation);
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
        <Box>
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
          label={''}
          min={0}
          name={`${props.name}.triggerOccurrence`}
          noMarginTop={false}
          onChange={formik.handleChange}
          sx={{ maxHeight: '32px', maxWidth: '90px', minWidth: '70px' }}
          type="number"
        />
        <Box>
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

// const StyledOperatorAutocomplete = styled(Autocomplete, {
//   label: 'StyledOperatorAutocomplete',
// })({
//   '& .MuiInputBase-root': {
//     width: '100px',
//   },
//   minWidth: '100px',
//   // paddingLeft: '5px',
//   width: '100px',
// });

// const StyledTextFieldThreshold = styled(TextField, {
//   label: 'StyledTextFieldThreshold',
// })({
//   // '& .MuiBox-root.css-15ybjgl': {
//   //   marginLeft: '10px',
//   // },
//   minWidth: '60px',
//   // marginLeft: '10px',
//   // paddingLeft: '5px',
//   // paddingLeft: '15px',
//   width: '60px',
// });
