import { API_ROOT } from 'src/constants';
import Request, { setURL, setMethod, setData } from '../request';
import { Alert, CreateAlertDefinitionPayload } from './types';
import { createAlertDefinitionSchema } from '@linode/validation';

export const createAlertDefinition = (data: CreateAlertDefinitionPayload) =>
  Request<Alert>(
    setURL(`${API_ROOT}/monitor/cloudpulse/alerts`),
    setMethod('POST'),
    setData(data, createAlertDefinitionSchema)
  );
