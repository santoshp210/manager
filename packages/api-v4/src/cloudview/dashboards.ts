import { API_ROOT } from '../constants';
import Request, { setMethod, setURL } from '../request';
import { Dashboard } from './types';
import { ResourcePage as Page } from '../types';

export const getDashboardById = (dashboardId?: number) =>
  Request<Dashboard>(
    setURL(
      `${API_ROOT}/cloudview/dashboards/${encodeURIComponent(dashboardId!)}`
    ),
    setMethod('GET')
  );

export const getDashboards = () =>
  Request<Page<Dashboard>>(
    setURL(`${API_ROOT}/cloudview/dashboards`),
    setMethod('GET')
);
