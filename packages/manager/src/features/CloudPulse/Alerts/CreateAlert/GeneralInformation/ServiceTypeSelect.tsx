import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { useCloudPulseServiceTypes } from 'src/queries/cloudpulse/services';

interface CloudPulseServiceSelectProps {
  /**
   * name used for the component to set formik field
   */
  name: string;
}

type CloudPulseServiceTypeOptions = {
  label: string;
  value: string;
};

export const CloudPulseServiceSelect = (
  props: CloudPulseServiceSelectProps
) => {
  const { name } = props;
  const {
    data: serviceOptions,
    error: serviceTypesError,
    isLoading: serviceTypesLoading,
  } = useCloudPulseServiceTypes(true);
  const { control, setValue } = useFormContext();

  const [
    selectedService,
    setSelectedService,
  ] = React.useState<CloudPulseServiceTypeOptions | null>(null);

  React.useEffect(() => {
    setValue(name, selectedService?.value ?? '');
  }, [name, selectedService, setValue]);

  const getServicesList = (): CloudPulseServiceTypeOptions[] => {
    return serviceOptions
      ? serviceOptions.data.map((service) => ({
          label: service.service_type.toUpperCase(),
          value: service.service_type,
        }))
      : [];
  };

  return (
    <Controller
      render={({ field, fieldState }) => (
        <Autocomplete
          errorText={
            fieldState.error?.message ?? serviceTypesError
              ? 'Unable to load service types'
              : ''
          }
          isOptionEqualToValue={(option, value) => {
            return option.value === value.value;
          }}
          onChange={(_, newValue) => {
            setSelectedService(newValue);
          }}
          data-testid="servicetype-select"
          fullWidth
          label="Service"
          loading={serviceTypesLoading && !serviceTypesError}
          noMarginTop
          onBlur={field.onBlur}
          options={getServicesList()}
          placeholder="Select a service"
          sx={{ marginTop: '5px' }}
          value={selectedService}
        />
      )}
      control={control}
      name={name}
    />
  );
};
