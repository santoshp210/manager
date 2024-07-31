import * as React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { DocumentTitleSegment } from 'src/components/DocumentTitle/DocumentTitle';
import { SuspenseLoader } from 'src/components/SuspenseLoader';

import { RecentActivity } from './Alerts/AlertLanding/RecentActivity';
import { CloudPulseLanding } from './CloudPulseLanding';

const AlertCreate = React.lazy(
  () => import('./Alerts/CreateAlert/CreateAlertDefinitionDrawer')
);
const AlertLanding = React.lazy(
  () => import('./Alerts/AlertLanding/AlertsLanding')
);
const CloudPulse = () => {
  const { path } = useRouteMatch();
  // eslint-disable-next-line no-console
  console.log(path);
  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <DocumentTitleSegment segment="Alerts" />
      {/* <ProductInformationBanner bannerLocation="Alerts" /> */}
      <Switch>
        {/* <Route component={AlertCreate} path={`${path}/alerts/create`} />
        <Route component={RecentActivity} path={`${path}/alerts/activity`} />
        <Route component={AlertLanding} path={`${path}/alerts`} /> */}
        {/* <Redirect to="alerts" /> */}
        <Route component={CloudPulseLanding} path={`${path}/monitor/cloudpulse`} />
        <Redirect
          from="/monitor/cloudpulse/alerts"
          to="/monitor/cloudpulse/alerts/activity"
        />
        <Redirect
          from="/monitor/cloudpulse"
          to="/monitor/cloudpulse/dashboards"
        />
      </Switch>
    </React.Suspense>
  );
};

export default CloudPulse;
