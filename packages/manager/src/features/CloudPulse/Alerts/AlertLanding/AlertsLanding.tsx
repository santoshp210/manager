import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from 'react-router-dom';

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
    // {
    //   routeName: '',
    //   title: 'Alert Creation',
    // },
  ];
  const [open, setOpen] = React.useState(false);
  const onCancel = {};
  const navToURL = (index: number) => {
    history.push(tabs[index].routeName);
  };
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
      <Tabs style={{ width: '100%' }} onChange={navToURL}>
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
            onClick={(e) =>{
              // <Route
              //   component={CreateAlertDefinitionDrawer}
              //   path={`${path}/alerts/create`}
              // ></Route>
              console.log(history.location);
              history.push(`${path}/definitions/create`);
              // setOpen(true)
            }
              
            }
            buttonType="primary"
            sx={{ marginRight: 2 }}
            variant="contained"
          >
            Create Alert Definition
          </Button>
        </Box>
        {/* <TabPanels>
          {tabs.map((tab, idx) => (
            <SafeTabPanel index={idx} key={`tab-${idx}`}>
              <Paper
                sx={{
                  padding: 2,
                }}
              >
                <Typography variant="body1">{ (!open) && `Content for ${tab.title}` }</Typography>

                 {open && (
                  <CreateAlertDefinitionDrawer
                    onCancel={() => setOpen(false)}
                  />
                )} 
              </Paper>
            </SafeTabPanel>
          ))}
        </TabPanels> */}
        <Switch>
          <Route path={`/monitor/cloudpulse/alerts/activity`} component={recent} />
          <Route path="/monitor/cloudpulse/alerts/definitions" component={Definition} />
          <Route path="/monitor/cloudpulse/alerts/notification" component={Notify} />
          <Redirect from="/monitor/cloudpulse/alerts" to="/monitor/cloudpulse/alerts/activity" />
        </Switch>
      </Tabs>
    </Paper>
  );
});

export default AlertsLanding;


const recent = () => {
  return (<>recent</>);
}

const Definition = () => {
  return (<>
  <p>Definition</p>
   <Switch >
      <Route component={CreateAlertDefinitionDrawer}  
      path={`/monitor/cloudpulse/alerts/definitions/create`}
      ></Route>
   </Switch>
  </>);
}

const Notify = () => {
  return (<>Notify</>);
}
