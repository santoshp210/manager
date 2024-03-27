import { Dashboard, getDashboardById, getDashboards } from '@linode/api-v4/lib/cloudview';
import {
    APIError, ResourcePage
} from '@linode/api-v4/lib/types';

import { useQuery } from '@tanstack/react-query';
import { queryPresets } from '../base';

export const queryKey = 'cloudview-dashboards';



export const useCloudViewDashboardByIdQuery = (dashboardId: number | undefined) => {

    return useQuery<Dashboard, APIError[]>(
        [queryKey, dashboardId], //querykey and dashboardId makes this uniquely identifiable
        () => getDashboardById(dashboardId!),
        {
            enabled: dashboardId != undefined
        }    //run this only if dashboarID is valid one 
    );
}

export const useCloudViewDashboards = (enabled: boolean = true) => {
    return useQuery<ResourcePage<Dashboard>, APIError[]>(
        [queryKey, 'dashboards'],
        () => getDashboards(),{
            ...queryPresets.longLived,
            enabled,
            keepPreviousData: true,
        }
    );
}