import * as React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { Paper } from 'src/components/Paper';
import { SafeTabPanel } from 'src/components/Tabs/SafeTabPanel';
import { TabLinkList } from 'src/components/Tabs/TabLinkList';
import { TabPanels } from 'src/components/Tabs/TabPanels';
import { Tabs } from 'src/components/Tabs/Tabs';
import { Typography } from 'src/components/Typography';

import CreateAlertDefinitionDrawer from '../CreateAlert/CreateAlertDefinitionDrawer';
const AlertsLanding = React.memo(() => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const tabs = [
    {
      routeName: 'alerts/activity',
      title: 'Recent activity',
    },
    {
      routeName: 'alerts/definitions',
      title: 'Definitions',
    },
    {
      routeName: 'alerts/notification',
      title: 'Notification Channel',
    },
    // {
    //   routeName: '',
    //   title: 'Alert Creation',
    // },
  ];
  const [open, setOpen] = React.useState(false);
  const onCancel = {};
  return (
    // <>
    //   <Paper>
    //     <LandingHeader
    //       breadcrumbProps={{ pathname: '/' }}
    //       createButtonText="Create alert Definition"
    //       entity="Alert"
    //       onButtonClick={toggleDrawer(true)}
    //       title={''}
    //     ></LandingHeader>
    //     {/* <AlertTabs history={undefined} location={undefined} match={undefined}/> */}
    //     <Placeholder
    //       icon={Alerts}
    //       subtitle={'Add new alert definition to start alert monitoring'}
    //       title={''}
    //     ></Placeholder>
    //   </Paper>
    //   <CreateAlertDefinitionDrawer
    //     onClose={toggleDrawer(false)}
    //     open={open}>
    //     </CreateAlertDefinitionDrawer>
    // </>
    <Paper>
      <Tabs style={{ width: '100%' }}>
        <Box
          sx={{
            aligneItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            width: '100%',
          }}
        >
          <TabLinkList noLink tabs={tabs} />
          <Button
            onClick={() =>
              // <Route
              //   component={CreateAlertDefinitionDrawer}
              //   path={`${path}/alerts/create`}
              // ></Route>
              // history.push('alerts/create')
              setOpen(true)
            }
            buttonType="primary"
            sx={{ marginRight: 2 }}
            variant="contained"
          >
            Create Alert Definition
          </Button>
        </Box>
        <TabPanels>
          {tabs.map((tab, idx) => (
            <SafeTabPanel index={idx} key={`tab-${idx}`}>
              <Paper
                sx={{
                  padding: 2,
                }}
              >
                <Typography variant="body1">Content for {tab.title}</Typography>

                {open && (
                  <CreateAlertDefinitionDrawer
                    onCancel={() => setOpen(false)}
                  />
                )}
              </Paper>
            </SafeTabPanel>
          ))}
          {/* <SafeTabPanel index={0}>
            <CreateAlertDefinitionDrawer />
          </SafeTabPanel> */}
        </TabPanels>
      </Tabs>
    </Paper>
  );
});

export default AlertsLanding;
