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
                    data={metricDefinitions ? metricDefinitions.data : []}
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
