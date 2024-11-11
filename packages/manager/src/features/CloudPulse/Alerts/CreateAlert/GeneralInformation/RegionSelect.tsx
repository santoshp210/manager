import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
import { useRegionsQuery } from 'src/queries/regions/regions';

export interface CloudViewRegionSelectProps {
  /**
   * name used for the component to set formik field
   */
  name: string;
}

export const CloudPulseRegionSelect = React.memo(
  (props: CloudViewRegionSelectProps) => {
    const { name } = props;
    const { data: regions } = useRegionsQuery();
    const { control, setValue } = useFormContext();
    return (
      <Controller
        render={({ field, fieldState }) => (
          <RegionSelect
            onChange={(_, value) => {
              setValue(name, value ? value.id : '');
            }}
            currentCapability={undefined}
            disableClearable={false}
            fullWidth
            label="Region"
            placeholder="Select a Region"
            regions={regions ?? []}
            textFieldProps={{ onBlur: field.onBlur }}
            value={field.value}
          />
        )}
        control={control}
        name={name}
      />
    );
  }
);
