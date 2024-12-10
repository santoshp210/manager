import { Box, Button, Stack, Typography } from '@linode/ui';
import * as React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useGetCloudPulseMetricDefinitionsByServiceType } from 'src/queries/cloudpulse/services';

import { convertToSeconds } from '../utilities';
import { Metric } from './Metric';

import type { CreateAlertDefinitionForm, MetricCriteriaForm } from '../types';
import type { AlertServiceType } from '@linode/api-v4';
import type { FieldPathByValue } from 'react-hook-form';

interface MetricCriteriaProps {
  /**
   * name used for the component to set formik field
   */
  name: FieldPathByValue<CreateAlertDefinitionForm, MetricCriteriaForm[]>;
  /**
   * serviceType used by the api to fetch the metric definitions
   */
  serviceType: AlertServiceType | null;
  /**
   * function used to pass the scrape interval value to the parent component
   * @param maxInterval number value that takes the maximum scrape interval from the list of selected metrics
   * @returns void
   */
  setMaxInterval: (maxInterval: number) => void;
}

export const MetricCriteriaField = (props: MetricCriteriaProps) => {
  const { name, serviceType, setMaxInterval } = props;
  const {
    data: metricDefinitions,
    isError: isMetricDefinitionError,
    isLoading: isMetricDefinitionLoading,
  } = useGetCloudPulseMetricDefinitionsByServiceType(
    serviceType!,
    serviceType !== null
  );

  const { control, watch } = useFormContext<CreateAlertDefinitionForm>();

  const metricCriteriaWatcher = watch(name);
  React.useEffect(() => {
    const formMetricValues = new Set(
      metricCriteriaWatcher.map((item: MetricCriteriaForm) => item.metric)
    );

    const intervalList =
      metricDefinitions &&
      metricDefinitions.data
        .filter((item) => formMetricValues.has(item.metric))
        .map((item) => item.scrape_interval);
    const maxInterval = Math.max(
      ...convertToSeconds(intervalList ? intervalList : [])
    );
    setMaxInterval(maxInterval);
  }, [setMaxInterval, metricCriteriaWatcher, metricDefinitions]);

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
        {fields.map((field, index) => {
          return (
            <Metric
              apiError={[isMetricDefinitionError, isMetricDefinitionLoading]}
              data={metricDefinitions ? metricDefinitions.data : []}
              key={field.id}
              name={`rule_criteria.rules.${index}`}
              onMetricDelete={() => remove(index)}
              showDeleteIcon={fields.length > 1}
            />
          );
        })}
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
};
