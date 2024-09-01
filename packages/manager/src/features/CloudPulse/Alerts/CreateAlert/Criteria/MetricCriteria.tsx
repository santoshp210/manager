import { FieldArray, useFormikContext } from 'formik';
import * as React from 'react';

import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';
import { useGetCloudPulseMetricDefinitionsByServiceType } from 'src/queries/cloudpulse/services';

import { convertSeconds } from '../../constants';
import { Metric } from './Metric';

interface MetricCriteriaProps {
  /**
   * function used to pass the scrape interval value to the parent component
   * @param maxInterval number value that takes the maximum scrape interval from the list of selected metrics
   * @returns void
   */
  getMaxInterval: (maxInterval: number) => void;
  /**
   * name used for the component to set formik field
   */
  name: string;
  /**
   * serviceType used by the api to fetch the metric definitions
   */
  serviceType: string;
}

export const MetricCriteriaField = React.memo((props: MetricCriteriaProps) => {
  const {
    data: metricDefinitions,
    isError: isMetricDefinitionError,
    isLoading: isMetricDefinitionLoading,
  } = useGetCloudPulseMetricDefinitionsByServiceType(
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
              alignItems={'center'}
              display={'flex'}
              justifyContent={'space-between'}
              sx={{ marginBottom: 1 }}
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
