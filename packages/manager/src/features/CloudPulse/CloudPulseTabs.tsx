import { styled } from '@mui/material/styles';
import * as React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  matchPath,
} from 'react-router-dom';

import { SuspenseLoader } from 'src/components/SuspenseLoader';
import { SafeTabPanel } from 'src/components/Tabs/SafeTabPanel';
import { TabLinkList } from 'src/components/Tabs/TabLinkList';
import { TabPanels } from 'src/components/Tabs/TabPanels';
import { Tabs } from 'src/components/Tabs/Tabs';

// import {
//   AlertDefinition,
//   AlertDefinitionLanding,
// } from './Alerts/AlertDefinitionLanding';
// import { DashboardLanding } from './Dashboard/DashboardLanding';
import Alerts from '.';
// import { AlertsLanding } from './Alerts/AlertLanding/AlertsLanding';
import Alert from '.';
import AlertsLanding from './Alerts/AlertLanding/AlertsLanding';
type Props = RouteComponentProps<{}>;

export const CloudPulseTabs = React.memo((props: Props) => {
  const tabs = [
    {
      routeName: `${props.match.url}/dashboards`,
      title: 'Dashboards',
    },
    {
      routeName: `${props.match.url}/alerts/`,
      title: 'Alerts',
    },
  ];

  const matches = (p: string) => {
    return Boolean(matchPath(props.location.pathname, { path: p, exact: false }));
  };

  const navToURL = (index: number) => {
    props.history.push(tabs[index].routeName);
  };

  return (
    <StyledTabs
      index={Math.max(
        tabs.findIndex((tab) => matches(tab.routeName)),
        0
      )}
      onChange={navToURL}
    >
      <TabLinkList tabs={tabs} />

      <React.Suspense fallback={<SuspenseLoader />}>
        {/* <TabPanels>
          <SafeTabPanel index={0}>
            <Switch>
              <Route
                component={dashboard}
                path={`${props.match.url}/dashboards`}
              />
            </Switch>
          </SafeTabPanel>
          <SafeTabPanel index={1}>
            <Switch>
              <Route
                component={AlertsLanding}
                path={`${props.match.url}/alerts`}
              />
            </Switch>
          </SafeTabPanel>
        </TabPanels> */}
        <Switch>
          <Route component={dashboard} path={`${props.match.url}/dashboards`} />
          <Route component={AlertsLanding} path={`${props.match.url}/alerts`} /> 
          <Redirect
            from="/monitor/cloudpulse"
            to="/monitor/cloudpulse/dashboards"
          />
        </Switch>
      </React.Suspense>
    </StyledTabs>
  );
});

const dashboard = () => {
  return <>Dashboard</>;
};
const StyledTabs = styled(Tabs, {
  label: 'StyledTabs',
})(() => ({
  marginTop: 0,
}));
