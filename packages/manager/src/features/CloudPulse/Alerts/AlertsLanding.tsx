import * as React from 'react';

import Alerts from 'src/assets/icons/bell_new.svg';
import { LandingHeader } from 'src/components/LandingHeader';
import { Paper } from 'src/components/Paper';
import { Placeholder } from 'src/components/Placeholder/Placeholder';

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
            ''
            //     <Route component={CloudPulseTabs} />
            //   </Switch>
          } //   <Switch>
          // title={
          //   <EntityHeader>
          //     <Route component={AlertTabs} />
          //     {/* <Button onClick={toggleDrawer(true)} buttonType="primary">
          //     Create
          //   </Button> */}
          //   </EntityHeader>
          // }
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
