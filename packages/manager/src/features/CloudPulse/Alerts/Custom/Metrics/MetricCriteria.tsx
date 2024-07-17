/* eslint-disable no-console */
import { MetricCriteria } from '@linode/api-v4';
import Grid from '@mui/material/Unstable_Grid2';
import { Field, FieldArray, getIn, useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { Stack } from 'src/components/Stack';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
import { useGetCloudViewMetricDefinitionsByServiceType } from 'src/queries/cloudpulse/services';

import { AggregationTypeField } from './AggregationTypeField';
import { Metric } from './Metric';
import { MetricDataField } from './MetricDataField';

interface MetricCriteriaProps {
  // handleMetricChange: (metric: any) => void;
  name: string;
  serviceType: string;
}
const mockData = [
  {
    available_aggregate_functions: ['avg', 'sum', 'count', 'min'],
    dimensions: [
      {
        dim_label: 'device',
        label: 'Device name',
        values: ['loop0', 'sda', 'sdb'],
      },
      {
        dim_label: 'direction',
        label: 'Operation direction',
        values: ['read', 'write'],
      },
      {
        dim_label: 'LINODE_ID',
        label: 'Linode ID',
        values: null,
      },
    ],
    metric: 'CPU',
    unit: 'percentage',
  },
  {
    available_aggregate_functions: ['avg', 'sum', 'min'],
    dimensions: [
      {
        dim_label: 'device',
        label: 'Device name',
        values: ['loop0', 'sda', 'sdb'],
      },
      {
        dim_label: 'direction',
        label: 'Operation direction',
        values: ['read', 'write'],
      },
      {
        dim_label: 'LINODE_ID',
        label: 'Linode ID',
        values: null,
      },
    ],
    metric: 'Temp',
    unit: 'celcius',
  },
];

export const MetricCriteriaField = React.memo((props: MetricCriteriaProps) => {
  const {
    data: metricDefinitions,
  } = useGetCloudViewMetricDefinitionsByServiceType(
    props.serviceType,
    props.serviceType !== ''
  );

  const formik = useFormikContext<any>();

  return (
    <Box sx={{ marginTop: '25px' }}>
      <FieldArray name={'criteria'}>
        {({ push, remove }) => (
          <>
            <Box
              alignItems={'center'}
              display={'flex'}
              justifyContent={'space-between'}
            >
              <Typography sx={{ paddingLeft: '5px' }} variant={'h3'}>
                Criteria
              </Typography>
              <Button
                onClick={() =>
                  push({
                    aggregationType: '',
                    filters: [],
                    metric: '',
                    operator: '',
                    value: 0,
                  })
                }
                size="small"
                type="button"
                variant="outlined"
              >
                {' '}
                +Add Metric
              </Button>
            </Box>
            <Stack spacing={2}>
              {formik.getFieldProps(`criteria`).value.map((_, index) => (
                <Metric
                  data={metricDefinitions ? metricDefinitions.data : []}
                  key={index}
                  name={`criteria[${index}]`}
                  onMetricDelete={() => remove(index)}
                  // getScrapeInterval={getIntervals}
                />
              ))}
            </Stack>
          </>
        )}
      </FieldArray>
    </Box>
  );
});
