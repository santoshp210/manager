/* eslint-disable no-console */
import { useFormikContext } from 'formik';
import * as React from 'react';

import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
import { useRegionsQuery } from 'src/queries/regions/regions';

export interface CloudViewRegionSelectProps {
  handleRegionChange: (region: string | undefined) => void;
  name: string;
}

export const CloudViewRegionSelect = React.memo(
  (props: CloudViewRegionSelectProps) => {
    const { data: regions } = useRegionsQuery();
    // const { handleRegionChange } = props;

    const formik = useFormikContext();
    const values = formik.getFieldProps(props.name).value;

    return (
      <RegionSelect
        handleSelection={(value) => {
          formik.setFieldValue(`${props.name}`, value);
        }}
        currentCapability={undefined}
        fullWidth
        isClearable={false}
        label="Region"
        noMarginTop
        regions={regions ? regions : []}
        selectedId={values}
      />
    );
  }
);
