/* eslint-disable no-console */
import { useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import {
  useLinodeResourcesQuery,
  useLoadBalancerResourcesQuery,
} from 'src/queries/cloudpulse/resources';
import { getAllDatabases, useDatabaseEnginesQuery } from 'src/queries/databases';

interface CloudViewResourceSelectProps {
  cluster: boolean;
  disabled: boolean;
  handleResourceChange: (resource: any) => void;
  name: string;
  region: string | undefined;
  resourceType: string | undefined;
}

export const CloudViewMultiResourceSelect = (
  props: CloudViewResourceSelectProps
) => {
  const resourceOptions: any = {};

  const formik = useFormikContext();
  const values = formik.getFieldProps(props.name).value;
  const [selectedResource, setResource] = React.useState<any>([]);
  // const [resourceInputValue, setResourceInputValue] = React.useState<any>('');
  const filterResourcesByRegion = (resourcesList: any[]) => {
    return resourcesList?.filter((resource: any) => {
      if (props.region == undefined) {
        return true;
      }
      if (resource.region) {
        return resource.region === props.region;
      } else if (resource.regions) {
        return resource.regions.includes(props.region);
      } else {
        return false;
      }
    });
  };

  const getResourceList = () => {
    // console.log(resourceOptions[props.resourceType!]);
    return props.resourceType && resourceOptions[props.resourceType]
      ? filterResourcesByRegion(resourceOptions[props.resourceType]?.data)
      : [];
  };

  ({ data: resourceOptions['linode'] } = useLinodeResourcesQuery(
    props.resourceType === 'linode'
  ));
  // ({ data: resourceOptions['db'] } = useDatabaseEnginesQuery(
  //   props.resourceType === 'db'
  // ));
  // console.log(resourceOptions);
    // ({ data: resourceOptions['ACLB'] } = useLoadBalancerResourcesQuery(
    //   props.resourceType === 'ACLB'
    // ))

  React.useEffect(() => {
    formik.setFieldValue(
      `${props.name}`,
      selectedResource.map((resource: any) => {
        return resource.id + '';
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResource]);

  React.useEffect(() => {
    setResource([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.region, props.resourceType]);

  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => {
        return option.id === value.id;
      }}
      onChange={(_: any, resources: any) => {
        // console.log(resources.map((resource: any) => resource.id));
        // formik.setFieldValue(
        //   `${props.name}`,
        //   resources.map((resource: any) => resource)
        // );
        setResource(resources);
      }}
      autoHighlight
      clearOnBlur
      disabled={props.disabled}
      label={props.cluster ? 'Cluster' : 'Resources'}
      limitTags={2}
      multiple
      options={getResourceList()}
      placeholder="Select"
      value={selectedResource}
    />
  );
};
