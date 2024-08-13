import { useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { useCloudViewServices } from 'src/queries/cloudpulse/services';

interface CloudPulseServiceSelectProps {
  name: string;
}

export const CloudPulseServiceSelect = React.memo(
  (props: CloudPulseServiceSelectProps) => {
    const { data: serviceOptions } = useCloudViewServices();
    const formik = useFormikContext();

    const [selectedService, setSelectedService] = React.useState<any>('');

    React.useEffect(() => {
      formik.setFieldValue(
        props.name,
        selectedService.value ? selectedService.value : ''
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedService]);
    const getServicesList = () => {
      return serviceOptions ? serviceOptions.data : [];
    };
    return (
      <Autocomplete
        isOptionEqualToValue={(option, value) => {
          return option.value === value.value;
        }}
        onBlur={(event) => {
          formik.handleBlur(event);
          formik.setFieldTouched(props.name, true);
        }}
        onChange={(_: any, newValue) => {
          setSelectedService(newValue);
        }}
        data-testid="servicetype-select"
        disableClearable
        fullWidth
        label="Service"
        noMarginTop
        options={getServicesList()}
        placeholder="Select a service"
        sx={{ marginTop: '5px' }}
        value={selectedService ? selectedService : null}
      />
    );
  }
);
