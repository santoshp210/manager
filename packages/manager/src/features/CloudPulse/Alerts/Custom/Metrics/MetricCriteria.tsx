/* eslint-disable no-console */
import { MetricCriteria } from '@linode/api-v4';
import { styled, Theme, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
import { useGetCloudViewMetricDefinitionsByServiceType } from 'src/queries/cloudpulse/services';

import { AggregationTypeField } from './AggregationTypeField';
import { MetricDataField } from './MetricDataField';

interface MetricCriteriaProps {
  handleMetricChange: (metric: any) => void;
  serviceType: string;
  setScrapeInterval: (interval: any) => void;
}

export const MetricCriteriaField = React.memo((props: MetricCriteriaProps) => {
  const {
    data: metricDefinitions,
  } = useGetCloudViewMetricDefinitionsByServiceType(
    props.serviceType,
    props.serviceType !== ''
  );

  const [selectedMetric, setSelectedMetric] = React.useState<MetricCriteria>();

  const changeMetricValues = (value: any, field: string) => {
    if (!value) {
      return;
    }
    const tempMetric = value && {
      ...selectedMetric,
      [field]: value,
      ['filters']: [],
    };
    setSelectedMetric(tempMetric);
  };

  React.useEffect(() => {
    props.handleMetricChange(selectedMetric);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetric]);

  let unit: string = '';
  const getAggregateFunctions = () => {
    const metric = metricDefinitions?.data.find(
      (metric) => metric.metric === selectedMetric?.metric
    );
    unit = metric ? metric.unit : '';
    props.setScrapeInterval(metric ? metric.scrape_interval : '');
    return metric ? metric.available_aggregate_functions : [];
  };

  const theme = useTheme<Theme>();
  return (
    <Box sx={{ marginTop: '25px' }}>
      <Typography sx={{ paddingLeft: '5px' }} variant={'h3'}>
        Criteria
      </Typography>
      <Grid
        sx={{ backgroundColor: theme.bg.app, marginTop: '5px', padding: '5px' }}
      >
        <Stack>
          <Typography variant={'h3'}>Metric</Typography>
          <MetricDataField
            handleDataFieldChange={(value) =>
              changeMetricValues(value, 'metric')
            }
            metricDefinitions={metricDefinitions ? metricDefinitions?.data : []}
          />
          <Stack direction={'row'} spacing={1}>
            <AggregationTypeField
              handleValueChange={(value) =>
                changeMetricValues(value, 'aggregationType')
              }
              aggregrateFunctions={getAggregateFunctions()}
            />
            <div></div>
            <StyledOperatorAutocomplete
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(_, value) => {
                changeMetricValues(value?.value, 'operator');
              }}
              options={[
                {
                  label: '>',
                  value: '>',
                },
                {
                  label: '<',
                  value: '<',
                },
                {
                  label: '>=',
                  value: '>=',
                },
                {
                  label: '<=',
                  value: '<=',
                },
                {
                  label: '==',
                  value: '==',
                },
              ]}
              label={'Operator'}
            />
            <StyledTextFieldThreshold
              onChange={(event) =>
                changeMetricValues(
                  (event.target.value as unknown) as number,
                  'value'
                )
              }
              inputMode={'numeric'}
              label={'Threshold'}
            />
            <Typography
              align={'right'}
              sx={{ paddingTop: '45px', width: '10px' }}
              variant={'body1'}
            >
              {unit}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Box>
  );
});

const StyledOperatorAutocomplete = styled(Autocomplete, {
  label: 'StyledOperatorAutocomplete',
})({
  '& .MuiInputBase-root': {
    width: '70px',
  },
  minWidth: '70px',
  paddingLeft: '5px',
  width: '70px',
});

const StyledTextFieldThreshold = styled(TextField, {
  label: 'StyledTextFieldThreshold',
})({
  // '& .MuiBox-root.css-15ybjgl': {
  //   marginLeft: '10px',
  // },
  minWidth: '55px',
  // marginLeft: '10px',
  paddingLeft: '5px',
  // paddingLeft: '15px',
  width: '55px',
});
