import { AvailableMetrics } from '@linode/api-v4';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

interface MetricDataFieldProps {
  handleDataFieldChange: (selectedMetric: any) => void;
  metricDefinitions: any;
}

export const MetricDataField = React.memo((props: MetricDataFieldProps) => {
  const [selectedMetric, setSelectedMetric] = React.useState<AvailableMetrics>();

  React.useEffect(() => {
    props.handleDataFieldChange(selectedMetric?.metric);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetric]);
  return (
    <Autocomplete
      label={'Data field'}
      onChange={(_, metric: any) => setSelectedMetric(metric)}
      options={props.metricDefinitions ? props.metricDefinitions : []}
      textFieldProps={{ labelTooltipText: 'Data Fields' }}
      value={selectedMetric}
    />
  );
});
