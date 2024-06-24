import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Alerts from 'src/assets/icons/bell_new.svg';
import { Drawer } from 'src/components/Drawer';
import { EntityHeader } from 'src/components/EntityHeader/EntityHeader';
import { LandingHeader } from 'src/components/LandingHeader';
import { Paper } from 'src/components/Paper';
import { Placeholder } from 'src/components/Placeholder/Placeholder';

import { CloudPulseTabs } from '../CloudPulseTabs';
import { AlertTabs } from './AlertsTabs';
import { CreateAlertDefinitionDrawer } from './CreateAlertDefinitionDrawer';
export const AlertsLanding = React.memo(() => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <Paper>
        <LandingHeader
          title={
            //   <Switch>
            //     <Route component={CloudPulseTabs} />
            //   </Switch>
            'Recent alert activity'
          }
          breadcrumbProps={{ pathname: '/' }}
          createButtonText="Create alert Definition"
          entity="Alert"
          onButtonClick={toggleDrawer(true)}
        ></LandingHeader>
        {/* <AlertTabs history={undefined} location={undefined} match={undefined}/> */}
        <Placeholder
          icon={Alerts}
          subtitle={'Add new alert definition to start alert monitoring'}
          title={''}
        ></Placeholder>
      </Paper>
      <CreateAlertDefinitionDrawer
        onClose={toggleDrawer(false)}
        open={open}
      ></CreateAlertDefinitionDrawer>
    </>
  );
});
