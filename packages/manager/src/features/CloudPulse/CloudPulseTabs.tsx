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
import { TabLinkList } from 'src/components/Tabs/TabLinkList';
import { Tabs } from 'src/components/Tabs/Tabs';

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
    return Boolean(
      matchPath(props.location.pathname, { exact: false, path: p })
    );
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
