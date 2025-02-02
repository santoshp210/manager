import {
  createStackScript,
  getStackScript,
  getStackScripts,
  updateStackScript,
} from '@linode/api-v4';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getOneClickApps } from 'src/features/StackScripts/stackScriptUtils';
import { getAll } from 'src/utilities/getAll';

import { queryPresets } from './base';

import type {
  APIError,
  Filter,
  Params,
  ResourcePage,
  StackScript,
  StackScriptPayload,
} from '@linode/api-v4';
import type { EventHandlerData } from 'src/hooks/useEventHandlers';

export const getAllOCAsRequest = (passedParams: Params = {}) =>
  getAll<StackScript>((params) =>
    getOneClickApps({ ...params, ...passedParams })
  )().then((data) => data.data);

export const stackscriptQueries = createQueryKeys('stackscripts', {
  infinite: (filter: Filter = {}) => ({
    queryFn: ({ pageParam }) =>
      getStackScripts({ page: pageParam as number, page_size: 25 }, filter),
    queryKey: [filter],
  }),
  marketplace: {
    queryFn: () => getAllOCAsRequest(),
    queryKey: null,
  },
  stackscript: (id: number) => ({
    queryFn: () => getStackScript(id),
    queryKey: [id],
  }),
});

export const useMarketplaceAppsQuery = (enabled: boolean) => {
  return useQuery<StackScript[], APIError[]>({
    ...stackscriptQueries.marketplace,
    enabled,
    ...queryPresets.oneTimeFetch,
  });
};

export const useStackScriptQuery = (id: number, enabled = true) =>
  useQuery<StackScript, APIError[]>({
    ...stackscriptQueries.stackscript(id),
    enabled,
  });

export const useCreateStackScriptMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<StackScript, APIError[], StackScriptPayload>({
    mutationFn: createStackScript,
    onSuccess(stackscript) {
      queryClient.setQueryData(
        stackscriptQueries.stackscript(stackscript.id).queryKey,
        stackscript
      );
      queryClient.invalidateQueries({
        queryKey: stackscriptQueries.infinite._def,
      });
    },
  });
};

export const useUpdateStackScriptMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<StackScript, APIError[], Partial<StackScriptPayload>>({
    mutationFn: (data) => updateStackScript(id, data),
    onSuccess(stackscript) {
      queryClient.setQueryData(
        stackscriptQueries.stackscript(stackscript.id).queryKey,
        stackscript
      );
      queryClient.invalidateQueries({
        queryKey: stackscriptQueries.infinite._def,
      });
    },
  });
};

export const useStackScriptsInfiniteQuery = (
  filter: Filter = {},
  enabled = true
) =>
  useInfiniteQuery<ResourcePage<StackScript>, APIError[]>({
    ...stackscriptQueries.infinite(filter),
    enabled,
    getNextPageParam: ({ page, pages }) => {
      if (page === pages) {
        return undefined;
      }
      return page + 1;
    },
    initialPageParam: 1,
  });

export const stackScriptEventHandler = ({
  event,
  invalidateQueries,
}: EventHandlerData) => {
  // Keep the infinite store up to date
  invalidateQueries({
    queryKey: stackscriptQueries.infinite._def,
  });

  // If the event has a StackScript entity attached, invalidate it
  if (event.entity?.id) {
    invalidateQueries({
      queryKey: stackscriptQueries.stackscript(event.entity.id).queryKey,
    });
  }
};
