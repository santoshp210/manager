// import { API_ROOT } from 'src/constants';
import Request, { setURL, setMethod, setData, setHeaders } from '../request';
import { Alert, CreateAlertDefinitionPayload } from './types';
// import { createAlertDefinitionSchema } from '@linode/validation';

export const createAlertDefinition = (data: CreateAlertDefinitionPayload) =>
  Request<Alert>(
    setURL(
      `http://blr-lhvlls.bangalore.corp.akamai.com:9000/v4/simple/monitor/alerts`
    ),
    setMethod('POST'),
    setHeaders({
      Authorization: 'Bearer vagrant',
    }),
    setData(data)
  );
