import { useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { useCloudViewServices } from 'src/queries/cloudpulse/services';
import { useDatabaseEnginesQuery } from 'src/queries/databases';

interface CloudPulseServiceSelectProps {
  name: string;
}

export const CloudPulseServiceSelect = React.memo(
  (props: CloudPulseServiceSelectProps) => {
    const { data: serviceOptions, isError } = useCloudViewServices();
    const { data: engineOptions } = useDatabaseEnginesQuery(true);
    const formik = useFormikContext();

    const [selectedService, setService] = React.useState<any>('');
    const [databaseService, setDatabaseService] = React.useState(false);
    const [selectedDatabase, setDatabase] = React.useState<any>('');
    const getEnginesList = () => {
      if (engineOptions === undefined) {
        return [];
      }
      return (
        engineOptions &&
        engineOptions.map((option) => {
          return { group: option.engine, label: option.id, value: option.id };
        })
      );
    };

    const getServicesList = () => {
      if (serviceOptions === undefined || isError) {
        return [
          { label: 'Linodes', value: 'linode' },
          { label: 'DbasS', value: 'db' },
        ];
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

    return (
      <>
        <Autocomplete
          isOptionEqualToValue={(option, value) => {
            return option.value === value.value;
          }}
          onChange={(_: any, newValue) => {
            setDatabaseService(newValue.value === 'db' ? true : false);
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
        {databaseService && (
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            groupBy={(option) => option.group}
            label="Engine Options"
            onChange={(_: any, newValue) => setDatabase(newValue.value)}
            options={getEnginesList()}
            value={selectedDatabase}
          />
        )}
      </>
    );
  }
);
