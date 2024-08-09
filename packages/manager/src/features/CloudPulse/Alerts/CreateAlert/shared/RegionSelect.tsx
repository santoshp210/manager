import { useFormikContext } from 'formik';
import * as React from 'react';

import { RegionSelect } from 'src/components/RegionSelect/RegionSelect';
import { useRegionsQuery } from 'src/queries/regions/regions';

export interface CloudViewRegionSelectProps {
  name: string;
}

export const CloudPulseRegionSelect = React.memo(
  (props: CloudViewRegionSelectProps) => {
    const { data: regions } = useRegionsQuery();
    const formik = useFormikContext();
    const values = formik.getFieldProps(props.name);
    return (
      <RegionSelect
        handleSelection={(value) => {
          formik.setFieldValue(`${props.name}`, value ? value : '');
        }}
        onBlur={(event) => {
          formik.handleBlur(event);
          formik.setFieldTouched(`${props.name}`, true);
        }}
        // errorText={formik.touched.region && formik.errors.region}
        currentCapability={undefined}
        fullWidth
        isClearable={false}
        label="Region"
        noMarginTop
        regions={regions ? regions : []}
        selectedId={values.value ? values.value : null}
      />
    );
  }
);
