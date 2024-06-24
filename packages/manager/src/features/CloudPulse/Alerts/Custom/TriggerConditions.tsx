import { TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';

interface TriggerCondition {
  criteriaCondition: string;
  evaluationInterval: string;
  evaluationPeriod: string;
  triggerOccurrence: string;
}

interface TriggerConditionProps {
  handleConditionChange: (value: any) => void;
  pollingInterval: string;
}
export const TriggerConditions = React.memo((props: TriggerConditionProps) => {
  const [
    selectedCondition,
    setSelectedCondition,
  ] = React.useState<TriggerCondition>();

  const changeConditionValues = (value: any, field: string) => {
    if (!value) {
      return;
    }
    const tempCondition = value && { ...selectedCondition, [field]: value };
    setSelectedCondition(tempCondition);
  };

  React.useEffect(() => {
    props.handleConditionChange(selectedCondition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCondition]);

  const getIntervalOptions = () => {
    if (props.pollingInterval.endsWith('s')) {
      return [
        {
          label: props.pollingInterval,
          value: props.pollingInterval.slice(0, -1),
        },
      ];
    } else if (props.pollingInterval.endsWith('m')) {
      const val: number = +props.pollingInterval.slice(0, -1);
      return [
        {
          label: props.pollingInterval,
          value: (val * 60).toString(),
        },
      ];
    } else {
      return [];
    }
  };
  const options = React.useMemo(() => {
    return getIntervalOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pollingInterval]);
  return (
    <Box sx={{ paddingTop: '10px' }}>
      <Grid
        sx={{ backgroundColor: '#F4F5F6', marginTop: '10px', padding: '5px' }}
      >
        <Typography variant="h3"> Trigger Conditions</Typography>
        <Stack>
          <Autocomplete
            onChange={(_, value) => {
              changeConditionValues(value?.value, 'evaluationPeriod');
            }}
            options={[
              { label: '30s', value: '30' },
              { label: '1m', value: '60' },
              { label: '5m', value: '300' },
              { label: '30m', value: '1800' },
            ]}
            label={'Evaluation period'}
            size={'small'}
            textFieldProps={{ labelTooltipText: 'Evaluation period' }}
          ></Autocomplete>
          <Autocomplete
            onChange={(_, value) => {
              changeConditionValues(value?.value, 'evaluationInterval');
            }}
            options={[
              {
                label: '1m',
                value: '60',
              },
              {
                label: '5m',
                value: '300',
              },
              {
                label: '10m',
                value: '600',
              },
            ]}
            label={'Polling interval'}
            size={'small'}
            textFieldProps={{ labelTooltipText: 'Polling interval' }}
          ></Autocomplete>
          <Box sx={{ marginTop: '5px' }}>
            <Typography variant="h3">Trigger alert when:</Typography>
            <Stack
              alignItems={'center'}
              direction={'row'}
              marginTop={'5px'}
              spacing={1}
            >
              <Autocomplete
                onChange={(_, value) => {
                  changeConditionValues(value?.value, 'criteriaCondition');
                }}
                label={''}
                options={[{ label: 'All', value: 'All' }]}
                size={'small'}
              ></Autocomplete>
              <Typography>criteria are met for</Typography>
              <TextField
                onChange={(event) =>
                  changeConditionValues(event.target.value, 'triggerOccurrence')
                }
                type="number"
                variant="standard"
              />
              <Typography>occurence.</Typography>
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Box>
  );
});
