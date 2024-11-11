import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

interface EngineOptionProps {
  /**
   * list of engine options available
   */
  engineOptions: any[];
  /**
   * if the engine options query has encountered an error
   */
  isError: boolean;
  /**
   * if the engine options are still loading or not
   */
  isLoading: boolean;
  /**
   * name used for the component to set formik field
   */
  name: string;
}
interface CloudPulseEngineOptionType {
  group: '';
  label: '';
}
export const EngineOption = (props: EngineOptionProps) => {
  const [
    selectedDatabase,
    setDatabase,
  ] = React.useState<CloudPulseEngineOptionType | null>(null);
  const { control, setValue } = useFormContext();
  const { engineOptions, isError, isLoading, name } = props;

  React.useEffect(() => {
    setValue(name, selectedDatabase?.group ?? '');
  }, [name, selectedDatabase, setValue]);

  const getEnginesList = () => {
    if (engineOptions === undefined) {
      return [];
    }
    return (
      engineOptions?.map((option) => ({
        group: option.engine,
        label: option.id,
      })) ?? []
    );
  };

  return (
    <Controller
      render={({ field, fieldState }) => (
        <Autocomplete
          onChange={(_, newValue, reason) =>
            reason === 'selectOption' && setDatabase(newValue)
          }
          data-testid="engine-options"
          errorText={isError ? 'Unable to load Engine Options' : ''}
          groupBy={(option) => option.group}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          label="Engine Options"
          placeholder="Select an Engine"
          loading={isLoading && !isError}
          onBlur={field.onBlur}
          options={getEnginesList()}
          value={selectedDatabase}
          // errorText={fieldState.error?.message}
        />
      )}
      control={control}
      name={name}
    />
  );
};
