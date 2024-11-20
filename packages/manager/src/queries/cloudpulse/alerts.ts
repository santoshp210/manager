import { createAlertDefinition } from '@linode/api-v4/lib/cloudpulse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryFactory } from './queries';

import type {
  Alert,
  CreateAlertDefinitionPayload,
  NotificationChannel,
} from '@linode/api-v4/lib/cloudpulse';
import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';

export const useCreateAlertDefinition = (service_type: string) => {
  const queryClient = useQueryClient();
  return useMutation<Alert, APIError[], CreateAlertDefinitionPayload>({
    mutationFn: (data) => createAlertDefinition(data, service_type),
    onSuccess() {
      queryClient.invalidateQueries(queryFactory.alerts);
    },
  });
};

export const useAlertDefinitionsQuery = (
  serviceType: string,
  params?: Params,
  filter?: Filter
) => {
  return useQuery<ResourcePage<Alert>, APIError[]>({
    ...queryFactory.alerts._ctx.alerts(serviceType, params, filter),
  });
};

export const useAlertDefinitionQuery = (alertId: number) => {
  return useQuery<Alert, APIError[]>({
    ...queryFactory.alertById(alertId),
    enabled: alertId !== undefined,
  });
};
export const useNotificationChannels = () => {
  return useQuery<ResourcePage<NotificationChannel>, APIError[]>({
    ...queryFactory.notificationChannels,
  });
};
