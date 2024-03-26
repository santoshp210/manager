import { Dashboards, getDashboards } from '@linode/api-v4/lib/cloudview';
import { APIError, ResourcePage } from '@linode/api-v4/lib/types';
import { useQuery } from '@tanstack/react-query';

import { queryPresets } from '../base';

const queryKey = 'cloudpulse';
export const useDashboards = (enabled: boolean = true) => {
  return useQuery<ResourcePage<Dashboards>, APIError[]>(
    [queryKey, 'dashboards'],
    () => getDashboards(),
    {
      ...queryPresets.longLived,
      enabled,
      keepPreviousData: true,
    }
  );
};
