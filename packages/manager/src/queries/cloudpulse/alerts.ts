import {
  Alert,
  CreateAlertDefinitionPayload,
  createAlertDefinition,
} from '@linode/api-v4/lib/cloudpulse';
import {
  APIError,
  Filter,
  Params,
  ResourcePage,
} from '@linode/api-v4/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryPresets } from '../base';

export const queryKey = 'aclp-alerts';

export const useCreateAlertDefinition = () => {
  const queryClient = useQueryClient();
  return useMutation<Alert, APIError[], CreateAlertDefinitionPayload>(
    (data) => createAlertDefinition(data),
    {
      onSuccess() {
        queryClient.invalidateQueries([queryKey, 'paginated']);
      },
    }
  );
};
