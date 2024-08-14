import { FieldArray, useFormikContext } from 'formik';
import * as React from 'react';

import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';
import { useGetCloudViewMetricDefinitionsByServiceType } from 'src/queries/cloudpulse/services';

import { convertSeconds } from '../../../constants';
import { Metric } from './Metric';

interface MetricCriteriaProps {
  getMaxInterval: (maxInterval: number) => void;
  name: string;
  serviceType: string;
}

export const MetricCriteriaField = React.memo((props: MetricCriteriaProps) => {
  const {
    data: metricDefinitions,
    isError: isMetricDefinitionError,
    isLoading: isMetricDefinitionLoading,
  } = useGetCloudViewMetricDefinitionsByServiceType(
    props.serviceType,
    props.serviceType !== ''
  );

  const formik = useFormikContext<any>();

  React.useEffect(() => {
    const formikMetricValues = new Set(
      formik.getFieldProps(props.name).value.map((item: any) => item.metric)
    );

    const intervalList =
      metricDefinitions &&
      metricDefinitions.data
        .filter((item) => formikMetricValues.has(item.metric))
        .map((item) => item.scrape_interval);
    const maxInterval = Math.max(
      ...convertSeconds(intervalList ? intervalList : [])
    );
    props.getMaxInterval(maxInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.getFieldProps(props.name)]);

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing(3) })}>
      <FieldArray name={'criteria'}>
        {({ push, remove }) => (
          <>
            <Box
              sx={{ marginBottom: 1 }}
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
                    apiError={[
                      isMetricDefinitionError,
                      isMetricDefinitionLoading,
                    ]}
                    data={metricDefinitions ? metricDefinitions.data : []}
                    key={index}
                    name={`criteria[${index}]`}
                    onMetricDelete={() => remove(index)}
                  />
                ))}
            </Stack>
            <Button
              onClick={() =>
                push({
                  aggregation_type: '',
                  dimension_filters: [],
                  metric: '',
                  operator: '',
                  value: '',
                })
              }
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
