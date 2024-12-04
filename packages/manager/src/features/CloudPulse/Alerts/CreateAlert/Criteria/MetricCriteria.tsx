import { Box, Button, Stack, Typography } from '@linode/ui';
import * as React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useGetCloudPulseMetricDefinitionsByServiceType } from 'src/queries/cloudpulse/services';

import { convertSeconds } from '../../constants';
import { Metric } from './Metric';

import type { CreateAlertDefinitionForm, MetricCriteriaForm } from '../types';
import type { MetricCriteria } from '@linode/api-v4';
import type { FieldPathByValue } from 'react-hook-form';

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
  name: FieldPathByValue<CreateAlertDefinitionForm, MetricCriteriaForm[]>;
  /**
   * serviceType used by the api to fetch the metric definitions
   */
  serviceType: string;
}

export const MetricCriteriaField = React.memo((props: MetricCriteriaProps) => {
  const { getMaxInterval, name, serviceType } = props;
  const {
    data: metricDefinitions,
    isError: isMetricDefinitionError,
    isLoading: isMetricDefinitionLoading,
  } = useGetCloudPulseMetricDefinitionsByServiceType(
    serviceType,
    serviceType !== null
  );

  const { control, watch } = useFormContext<CreateAlertDefinitionForm>();

  const metricCriteriaWatcher = watch(name);
  React.useEffect(() => {
    const formikMetricValues = new Set(
      metricCriteriaWatcher.map((item: MetricCriteriaForm) => item.metric)
    );

    const intervalList =
      metricDefinitions &&
      metricDefinitions.data
        .filter((item) => formikMetricValues.has(item.metric))
        .map((item) => item.scrape_interval);
    const maxInterval = Math.max(
      ...convertSeconds(intervalList ? intervalList : [])
    );
    getMaxInterval(maxInterval);
  }, [getMaxInterval, metricCriteriaWatcher, metricDefinitions]);

  const { append, fields, remove } = useFieldArray({
    control,
    name,
  });
  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing(3) })}>
      <Box
        alignItems={'center'}
        display={'flex'}
        justifyContent={'space-between'}
        sx={{ marginBottom: 1 }}
      >
        <Typography variant={'h2'}>2. Criteria</Typography>
      </Box>
      <Stack spacing={2} sx={(theme) => ({ marginTop: theme.spacing(3) })}>
        {fields.map((_, index) => (
          <Metric
            showDeleteIcon={fields.length > 1}
            apiError={[isMetricDefinitionError, isMetricDefinitionLoading]}
            data={metricDefinitions ? metricDefinitions.data : []}
            key={index}
            name={`rule_criteria.rules.${index}`}
            onMetricDelete={() => remove(index)}
          />
        ))}
      </Stack>
      <Button
        onClick={() =>
          append({
            aggregation_type: null,
            dimension_filters: [],
            metric: null,
            operator: null,
            threshold: 0,
          })
        }
        buttonType={'outlined'}
        size="medium"
        sx={(theme) => ({ marginTop: theme.spacing(2) })}
      >
        Add metric
      </Button>
    </Box>
  );
});
