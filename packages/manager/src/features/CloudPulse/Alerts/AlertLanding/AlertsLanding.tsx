import * as React from 'react';
import {
  Redirect,
  Route,
  Switch,
  matchPath,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { Paper } from 'src/components/Paper';
import { TabLinkList } from 'src/components/Tabs/TabLinkList';
import { Tabs } from 'src/components/Tabs/Tabs';

import { AlertDefinition } from './AlertDefinitions';
import { Notify } from './Notification';
import { RecentActivity } from './RecentActivity';

const AlertsLanding = React.memo(() => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const tabs = [
    {
      routeName: `${path}/activity`,
      title: 'Recent activity',
    },
    {
      routeName: `${path}/definitions`,
      title: 'Definitions',
    },
    {
      routeName: `${path}/notification`,
      title: 'Notification Channel',
    },
  ];
  const location = useLocation();
  const navToURL = (index: number) => {
    history.push(tabs[index].routeName);
  };
  const matches = (p: string) => {
    return Boolean(matchPath(location.pathname, { exact: false, path: p }));
  };
  return (
    <Paper sx={{padding: { xs: 0, sm: 2}}}>
      <Tabs
        index={Math.max(
          tabs.findIndex((tab) => matches(tab.routeName)),
          0
        )}
        onChange={navToURL}
        style={{ width: '100%' }}
      >
        <Box
          sx={{
            aligneItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            p: 2,
            width: '100%',
          }}
        >
          <TabLinkList tabs={tabs} />
          {/* <Box> */}
          {location.pathname === `${path}/definitions` ? (
            <Box display={'flex'} alignItems={'center'}>
              <Button
                onClick={(event) => {
                  history.push(`${path}/definitions/create`);
                }}
                buttonType="primary"
                sx={{ marginRight: 2 }}
                variant="contained"
              >
                Create
              </Button>
            </Box>
          ) : null}
        </Box>
        <Switch>
          <Route
            component={RecentActivity}
            path={'/monitor/cloudpulse/alerts/activity'}
          />
          <Route
            component={() => <AlertDefinition />}
            path={'/monitor/cloudpulse/alerts/definitions'}
          />
          <Route
            component={Notify}
            path={'/monitor/cloudpulse/alerts/notification'}
          />
          <Redirect
            // exact
            from="/monitor/cloudpulse/alerts"
            to="/monitor/cloudpulse/alerts/activity"
          />
        </Switch>
      </Tabs>
    </Paper>
  );
});

export default AlertsLanding;
