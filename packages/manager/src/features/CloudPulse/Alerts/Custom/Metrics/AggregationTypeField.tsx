/* eslint-disable no-console */
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

interface AggregationFieldProps {
  aggregrateFunctions: any;
  handleValueChange: (aggType: any) => void;
}

export const AggregationTypeField = React.memo(
  (props: AggregationFieldProps) => {
    const [
      selectedAggregationType,
      setSelectedAggregationType,
    ] = React.useState<any>([]);

    const options = props.aggregrateFunctions
      ? props.aggregrateFunctions.map((agg: any) => {
          return { label: agg, value: agg };
        })
      : [];

    // eslint-disable-next-line no-console
    React.useEffect(() => {
      props.handleValueChange(selectedAggregationType.value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAggregationType]);
    return (
      <Autocomplete
        onChange={(_, value) => {
          setSelectedAggregationType(value);
        }}
        isOptionEqualToValue={(option, value) => option == value}
        label={'Aggregation type'}
        options={options}
        value={selectedAggregationType}
      ></Autocomplete>
    );
  }
);
