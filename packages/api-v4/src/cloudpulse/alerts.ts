import { createAlertDefinitionSchema } from '@linode/validation';
import Request, {
  setURL,
  setMethod,
  setData,
  setParams,
  setXFilter,
} from '../request';
import {
  Alert,
  CreateAlertDefinitionPayload,
  NotificationChannel,
} from './types';
import { BETA_API_ROOT as API_ROOT } from 'src/constants';
import { Filter, Params, ResourcePage } from 'src/types';

export const createAlertDefinition = (
  data: CreateAlertDefinitionPayload,
  serviceType: string
) =>
  Request<Alert>(
    setURL(
      `${API_ROOT}/monitor/${encodeURIComponent(serviceType)}/alert-definitions`
    ),
    setMethod('POST'),
    setData(data, createAlertDefinitionSchema)
  );

export const getAlertDefinitions = (
  serviceType: string,
  params?: Params,
  filters?: Filter
) =>
  Request<ResourcePage<Alert>>(
    setURL(
      `${API_ROOT}/monitor/${encodeURIComponent(serviceType)}/alert-definitions`
    ),
    setMethod('GET'),
    setParams(params),
    setXFilter(filters)
  );

export const getAlertDefinitionById = (alertId: number) =>
  Request<Alert>(
    setURL(
      `${API_ROOT}/monitor/alert-definitions/${encodeURIComponent(alertId)}`
    ),
    setMethod('GET')
  );
export const getNotificationChannels = () =>
  Request<ResourcePage<NotificationChannel>>(
    setURL(`${API_ROOT}/monitor/notification`),
    setMethod('GET')
  );
