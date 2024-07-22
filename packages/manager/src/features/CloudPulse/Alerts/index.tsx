import * as React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { DocumentTitleSegment } from 'src/components/DocumentTitle/DocumentTitle';
import { SuspenseLoader } from 'src/components/SuspenseLoader';

const AlertCreate = React.lazy(
  () => import('./CreateAlert/CreateAlertDefinitionDrawer')
);
const AlertLanding = React.lazy(() => import('./AlertLanding/AlertsLanding'));
const Alert = () => {
  const { path } = useRouteMatch();
  // eslint-disable-next-line no-console
  console.log(path);
  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <DocumentTitleSegment segment="Alerts" />
      {/* <ProductInformationBanner bannerLocation="Alerts" /> */}
      <Switch>
        <Route component={AlertCreate} path={`${path}/alerts/create`} />
        <Route component={AlertLanding} path={`${path}/alerts`} />
        {/* <Redirect to="alerts" /> */}
      </Switch>
    </React.Suspense>
  );
};

export default Alert;
