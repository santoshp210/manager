import {
  getAlertDefinitionById,
  getAlertDefinitions,
  getCloudPulseServiceTypes,
  getDashboardById,
  getDashboards,
  getJWEToken,
  getMetricDefinitionsByServiceType,
  getNotificationChannels,
} from '@linode/api-v4';
import { createQueryKeys } from '@lukemorales/query-key-factory';

import { databaseQueries } from '../databases/databases';
import { getAllLinodesRequest } from '../linodes/requests';
import { volumeQueries } from '../volumes/volumes';
import { fetchCloudPulseMetrics } from './metrics';

import type {
  CloudPulseMetricsRequest,
  Filter,
  JWETokenPayLoad,
  Params,
} from '@linode/api-v4';

const key = 'Clousepulse';

export const queryFactory = createQueryKeys(key, {
  alerts: {
    // This query key is a placeholder , it will be updated once the relevant queries are added
    queryKey: null,
  },
  alerts: (alertId: number) => ({
    queryFn: () => getAlertDefinitionById(alertId),
    queryKey: [alertId],
  }),
  dashboardById: (dashboardId: number) => ({
    queryFn: () => getDashboardById(dashboardId),
    queryKey: [dashboardId],
  }),
  lists: {
    contextQueries: {
      alerts: (serviceType: string, params?: Params, filter?: Filter) => ({
        queryFn: () => getAlertDefinitions(serviceType, params, filter),
        queryKey: [params, filter],
      }),
      dashboards: (serviceType: string) => ({
        queryFn: () => getDashboards(serviceType),
        queryKey: [serviceType],
      }),
      serviceTypes: {
        queryFn: getCloudPulseServiceTypes,
        queryKey: null,
      },
    },
    queryKey: null,
  },
  metrics: (
    token: string,
    readApiEndpoint: string,
    serviceType: string,
    requestData: CloudPulseMetricsRequest,
    timeStamp: number | undefined,
    label: string
  ) => ({
    queryFn: () =>
      fetchCloudPulseMetrics(token, readApiEndpoint, serviceType, requestData),
    queryKey: [requestData, timeStamp, label],
  }),

  metricsDefinitons: (serviceType: string | undefined) => ({
    queryFn: () => getMetricDefinitionsByServiceType(serviceType!),
    queryKey: [serviceType],
  }),
  notificationChannels: {
    queryFn: () => getNotificationChannels(),
    queryKey: null,
  },
  resources: (
    resourceType: string | undefined,
    params?: Params,
    filters?: Filter
  ) => {
    switch (resourceType) {
      case 'linode':
        return {
          queryFn: () => getAllLinodesRequest(params, filters), // since we don't have query factory implementation, in linodes.ts, once it is ready we will reuse that, untill then we will use same query keys
          queryKey: ['linodes', params, filters],
        };
      case 'volumes':
        return volumeQueries.lists._ctx.all(params, filters); // in this we don't need to define our own query factory, we will reuse existing implementation in volumes.ts

      case 'dbaas':
        return databaseQueries.databases._ctx.all(params, filters);

      default:
        return volumeQueries.lists._ctx.all(params, filters); // default to volumes
    }
  },
  serviceTypes: {
    queryFn: () => getCloudPulseServiceTypes(),
    queryKey: null,
  },
  token: (serviceType: string | undefined, request: JWETokenPayLoad) => ({
    queryFn: () => getJWEToken(request, serviceType!),
    queryKey: [serviceType],
  }),
});
