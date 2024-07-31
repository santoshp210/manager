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

const mockData = {
  data: [
    {
      available_aggregate_functions: ['min', 'max', 'avg'],
      dimensions: [
        { dim_label: 'cpu', label: 'CPU name', values: null },
        {
          dim_label: 'state',
          label: 'State of CPU',
          values: [
            'user',
            'system',
            'idle',
            'interrupt',
            'nice',
            'softirq',
            'steal',
            'wait',
          ],
        },
        { dim_label: 'LINODE_ID', label: 'Linode ID', values: null },
      ],
      label: 'CPU utilization',
      metric: 'system_cpu_utilization_percent',
      metric_type: 'gauge',
      scrape_interval: '2m',
      unit: 'percent',
    },
    {
      available_aggregate_functions: ['min', 'max', 'avg', 'sum'],
      dimensions: [
        {
          dim_label: 'state',
          label: 'State of memory',
          values: [
            'used',
            'free',
            'buffered',
            'cached',
            'slab_reclaimable',
            'slab_unreclaimable',
          ],
        },
        { dim_label: 'LINODE_ID', label: 'Linode ID', values: null },
      ],
      label: 'Memory Usage',
      metric: 'system_memory_usage_by_resource',
      metric_type: 'gauge',
      scrape_interval: '30s',
      unit: 'byte',
    },
    {
      available_aggregate_functions: ['min', 'max', 'avg', 'sum'],
      dimensions: [
        { dim_label: 'device', label: 'Device name', values: ['lo', 'eth0'] },
        {
          dim_label: 'direction',
          label: 'Direction of network transfer',
          values: ['transmit', 'receive'],
        },
        { dim_label: 'LINODE_ID', label: 'Linode ID', values: null },
      ],
      label: 'Network Traffic',
      metric: 'system_network_io_by_resource',
      metric_type: 'counter',
      scrape_interval: '30s',
      unit: 'byte',
    },
    {
      available_aggregate_functions: ['min', 'max', 'avg', 'sum'],
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
        { dim_label: 'LINODE_ID', label: 'Linode ID', values: null },
      ],
      label: 'Disk I/O',
      metric: 'system_disk_OPS_total',
      metric_type: 'counter',
      scrape_interval: '30s',
      unit: 'ops_per_second',
    },
  ],
};
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
              <Typography variant={'h2'}>2. Criteria</Typography>
            </Box>
            <Stack spacing={2}>
              {formik
                .getFieldProps(`criteria`)
                .value.map((_: any, index: any) => (
                  <Metric
                    data={
                      metricDefinitions ? metricDefinitions.data : mockData.data
                    }
                    // getScrapeInterval={}
                    key={index}
                    name={`criteria[${index}]`}
                    onMetricDelete={() => remove(index)}
                    // getScrapeInterval={getIntervals}
                  />
                ))}
            </Stack>
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
              // variant="outlined"
              buttonType={'outlined'}
              size="medium"
              sx={(theme) => ({ marginTop: theme.spacing(1) })}
            >
              Add Metric
            </Button>
          </>
        )}
      </FieldArray>
    </Box>
  );
});
