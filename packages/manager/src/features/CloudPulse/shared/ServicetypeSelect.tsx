/* eslint-disable no-console */
import { ServiceTypes, Services } from '@linode/api-v4';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { useCloudViewServices } from 'src/queries/cloudpulse/services';

export type CloudPulseResourceTypes = '' | 'ACLB' | 'linode' | undefined;

interface CloudPulseServiceSelectProps {
  handleServiceChange: (service: string | undefined) => void;
}

export const CloudPulseServiceSelect = React.memo(
  (props: CloudPulseServiceSelectProps) => {
    const { data: serviceOptions, isError, isLoading } = useCloudViewServices();

    const [selectedService, setService] = React.useState<any>('');

    const getServicesList = () => {
      if (serviceOptions === undefined || isError) {
        return [];
      }
      return (
        serviceOptions &&
        serviceOptions?.data.map((service) => {
          return { label: 'Linodes', value: service.service_type };
        })
      );
    };

    React.useEffect(() => {
      props.handleServiceChange(selectedService.value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedService]);

    if (isLoading) {
      return <Autocomplete disabled label="Service" options={[]} />;
    }
    return (
      <Autocomplete
        onChange={(_: any, service) => {
          setService(service);
          // props.handleServiceChange(service?.label);
        }}
        disableClearable
        fullWidth
        isOptionEqualToValue={(option, value) => option.value === value.value}
        label="Service"
        noMarginTop
        options={getServicesList()}
        sx={{ marginTop: '5px' }}
        value={selectedService}
      />
    );
  }
);
