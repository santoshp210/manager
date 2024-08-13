import { API_ROOT } from 'src/constants';
import Request, { setMethod, setURL } from '../request';
import { MetricDefinitions, ServiceTypes } from './types';
import { ResourcePage as Page } from 'src/types';

export const getCloudViewServiceTypes = () =>
  Request<ServiceTypes>(
    setURL(`${API_ROOT}/monitor/services`),
    setMethod('GET')
  );

export const getMetricDefinitionsByServiceType = (serviceType: string) => {
  return Request<Page<MetricDefinitions>>(
    setURL(`${API_ROOT}/monitor/services/${serviceType}/metric-definitions`),
    setMethod('GET')
  );
};
