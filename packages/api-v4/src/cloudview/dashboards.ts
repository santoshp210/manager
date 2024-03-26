import { API_ROOT } from '../constants';
import Request, { setMethod, setURL } from '../request';
import { Dashboards } from './types';
import { ResourcePage as Page } from '../types';

export const getDashboards = () =>
  Request<Page<Dashboards>>(
    setURL(`${API_ROOT}/cloudview/dashboards`),
    setMethod('GET')
  );
