import {
  Alert,
  CreateAlertDefinitionPayload,
  createAlertDefinition,
} from '@linode/api-v4/lib/cloudpulse';
import { APIError } from '@linode/api-v4/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
