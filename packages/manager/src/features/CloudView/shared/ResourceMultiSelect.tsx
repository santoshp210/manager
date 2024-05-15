/* eslint-disable no-console */
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import {
  useLinodeResourcesQuery,
  useLoadBalancerResourcesQuery,
} from 'src/queries/cloudview/resources';

interface CloudViewResourceSelectProps {
  disabled: boolean;
  handleResourceChange: (resource: any) => void;
  region: string | undefined;
  resourceType: string | undefined;
}

export const CloudViewMultiResourceSelect = (
  props: CloudViewResourceSelectProps
) => {
  const resourceOptions: any = {};

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

  ({ data: resourceOptions['linodes'] } = useLinodeResourcesQuery(
    props.resourceType === 'linodes'
  ));
  ({ data: resourceOptions['ACLB'] } = useLoadBalancerResourcesQuery(
    props.resourceType === 'ACLB'
  ));

  React.useEffect(() => {
    props.handleResourceChange(selectedResource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResource]);

  React.useEffect(() => {
    setResource([]);
    // setResourceInputValue('');
    // props.handleResourceChange([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.region, props.resourceType]);

  return (
    <Autocomplete
      onChange={(_: any, resource: any) => {
        setResource(resource);
      }}
      autoHighlight
      clearOnBlur
      data-testid={'Resource-select'}
      disabled={props.disabled}
      // inputValue={resourceInputValue}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      label=""
      limitTags={2}
      multiple
      options={getResourceList()? getResourceList(): []}
      placeholder="Select a resource"
      value={selectedResource ? selectedResource : []}
    />
  );
};
