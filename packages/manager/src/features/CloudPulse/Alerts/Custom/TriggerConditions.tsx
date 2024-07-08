import { TextField, Theme, styled, useTheme } from '@mui/material';
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
  // scrapingInterval: string;
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

  // const getIntervalOptions = () => {
  //   if (props.scrapingInterval.endsWith('s')) {
  //     return [
  //       {
  //         label: props.scrapingInterval,
  //         value: props.scrapingInterval.slice(0, -1),
  //       },
  //     ];
  //   } else if (props.scrapingInterval.endsWith('m')) {
  //     const val: number = +props.scrapingInterval.slice(0, -1);
  //     return [
  //       {
  //         label: props.scrapingInterval,
  //         value: (val * 60).toString(),
  //       },
  //     ];
  //   } else {
  //     return [];
  //   }
  // };

  const theme = useTheme<Theme>();
  // const options = React.useMemo(() => {
  //   return getIntervalOptions();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.pollingInterval]);
  return (
    <Box sx={{ paddingTop: '10px' }}>
      <Grid
        sx={{
          backgroundColor: theme.bg.app,
          marginTop: '10px',
          padding: '5px',
        }}
      >
        <Typography variant="h3"> Trigger Conditions</Typography>
        <Stack>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(_, value) => {
              changeConditionValues(value?.value, 'evaluationPeriod');
            }}
            options={[
              { label: '1m', value: '60' },
              { label: '5m', value: '300' },
              { label: '15m', value: '900' },
              { label: '30m', value: '1800' },
              { label: '1hr', value: '3600' },
            ]}
            label={'Evaluation period'}
            size={'small'}
            textFieldProps={{ labelTooltipText: 'Evaluation period' }}
          ></Autocomplete>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
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
          <Box sx={{ marginTop: '10px' }}>
            <Typography variant="h3">Trigger alert when:</Typography>
            <Stack
              alignItems={'center'}
              direction={'row'}
              marginTop={'10px'}
              spacing={1}
            >
              <StyledOperatorAutocomplete
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                onChange={(_, value) => {
                  changeConditionValues(value?.value, 'criteriaCondition');
                }}
                options={[
                  { label: 'All', value: 'All' },
                  { label: 'Any', value: 'Any' },
                ]}
                label={''}
                noMarginTop={true}
                size={'small'}
              />
              <Typography variant={'inherit'}>
                criteria are met for at least
              </Typography>
              <StyledTextFieldThreshold
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

const StyledOperatorAutocomplete = styled(Autocomplete, {
  label: 'StyledOperatorAutocomplete',
})({
  '& .MuiInputBase-root': {
    width: '100px',
  },
  minWidth: '100px',
  // paddingLeft: '5px',
  width: '100px',
});

const StyledTextFieldThreshold = styled(TextField, {
  label: 'StyledTextFieldThreshold',
})({
  // '& .MuiBox-root.css-15ybjgl': {
  //   marginLeft: '10px',
  // },
  minWidth: '60px',
  // marginLeft: '10px',
  // paddingLeft: '5px',
  // paddingLeft: '15px',
  width: '60px',
});
