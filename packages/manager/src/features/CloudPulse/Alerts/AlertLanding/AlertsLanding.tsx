import * as React from 'react';
import {
  Redirect,
  Route,
  Switch,
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
import { RecentActivity } from './RecentActivity';

const AlertsLanding = React.memo(() => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const tabs = [
    {
      routeName: 'activity',
      title: 'Recent activity',
    },
    {
      routeName: 'definitions',
      title: 'Definitions',
    },
    {
      routeName: 'notification',
      title: 'Notification Channel',
    },
  ];
  const [open, setOpen] = React.useState(false);
  const navToURL = (index: number) => {
    history.push(tabs[index].routeName);
  };
  const location = useLocation();
  return (
    <Paper>
      <Tabs onChange={navToURL} style={{ width: '100%' }}>
        <Box
          sx={{
            aligneItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            width: '100%',
          }}
        >
          <TabLinkList tabs={tabs} />
          {location.pathname.endsWith('definitions') ? (
            <Button
              onClick={(event) => {
                setOpen(true);
                history.push(`${path}/definitions/create`);
              }}
              buttonType="primary"
              sx={{ marginRight: 2 }}
              variant="contained"
            >
              Create
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <Switch>
          <Route
            component={RecentActivity}
            path={'/monitor/cloudpulse/alerts/activity'}
          />
          <Route
            component={AlertDefinition}
            path={'/monitor/cloudpulse/alerts/definitions'}
          />
          <Route
            component={Notify}
            path={'/monitor/cloudpulse/alerts/notification'}
          />
          <Redirect
            from="/monitor/cloudpulse/alerts"
            to="/monitor/cloudpulse/alerts/activity"
          />
        </Switch>
      </Tabs>
    </Paper>
  );
});

const Notify = () => {
  return <>Notify</>;
};

export default AlertsLanding;
