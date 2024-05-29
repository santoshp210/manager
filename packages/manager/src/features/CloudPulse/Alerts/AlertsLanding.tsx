import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

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
          breadcrumbProps={{ pathname: '/Recent alert activity' }}
          entity="Alert"
          onButtonClick={toggleDrawer(true)}
        ></LandingHeader>
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
