/* eslint-disable no-console */
import { ServiceTypes, Services } from '@linode/api-v4';
import { useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { useCloudViewServices } from 'src/queries/cloudpulse/services';

export type CloudPulseResourceTypes = '' | 'ACLB' | 'linode' | undefined;

interface CloudPulseServiceSelectProps {
  name: string;
}

export const CloudPulseServiceSelect = React.memo(
  (props: CloudPulseServiceSelectProps) => {
    const { data: serviceOptions, isError, isLoading } = useCloudViewServices();

    const formik = useFormikContext();
    const values = formik.getFieldProps(props.name).value;

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
      formik.setFieldValue(`${props.name}`, selectedService.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedService]);

    if (isLoading) {
      return <Autocomplete disabled label="Service" options={[]} />;
    }

    return (
      <Autocomplete
        isOptionEqualToValue={(option, value) => {
          return option.value === value.value;
        }}
        onChange={(_: any, newValue) => {
          setService(newValue);
        }}
        disableClearable
        fullWidth
        label="Service"
        noMarginTop
        options={getServicesList()}
        sx={{ marginTop: '5px' }}
        value={selectedService}
      />
    );
  }
);
