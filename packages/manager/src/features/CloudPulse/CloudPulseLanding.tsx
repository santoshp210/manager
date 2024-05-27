import * as React from 'react';

import { LandingHeader } from 'src/components/LandingHeader/LandingHeader';
import { Paper } from 'src/components/Paper';
import { CloudPulseTabs } from './CloudPulseTabs';
import { SuspenseLoader } from 'src/components/SuspenseLoader';
import { Switch, Route } from 'react-router-dom';

export const CloudPulseLanding = () => {
  return (
    <>
      <LandingHeader
        breadcrumbProps={{ pathname: '/Akamai Cloud Pulse' }}
        docsLabel="Getting Started"
        docsLink="https://www.linode.com/docs/"
      />
      <React.Suspense fallback={<SuspenseLoader />}>
        <Switch>
          <Route component={CloudPulseTabs} />
        </Switch>
      </React.Suspense>
    </>
  );
};
