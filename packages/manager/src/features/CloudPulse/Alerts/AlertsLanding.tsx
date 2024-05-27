import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Alerts from 'src/assets/icons/bell_new.svg';
import { Drawer } from 'src/components/Drawer';
import { LandingHeader } from 'src/components/LandingHeader';
import { Paper } from 'src/components/Paper';
import { Placeholder } from 'src/components/Placeholder/Placeholder';

import { CreateAlertDefinitionDrawer } from './CreateAlertDefinitionDrawer';
export const AlertsLanding = React.memo(() => {
  const location = useLocation();
  const history = useHistory();

  // eslint-disable-next-line no-console
  const isCreateAlertDefinitionDrawerOpen = location.pathname.endsWith(
    'create'
  );

  const onOpenCreateDrawer = () => {
    history.replace('/monitor/cloudpulse/alerts/create');
  };

  const onCloseCreateDrawer = () => {
    history.replace('/monitor/cloudpulse/alerts/');
  };
  return (
    <>
      <Paper>
        <LandingHeader
          breadcrumbProps={{ pathname: '/Recent alert activity' }}
          entity="Alert"
          onButtonClick={onOpenCreateDrawer}
        ></LandingHeader>
        <Placeholder
          icon={Alerts}
          subtitle={'Add new alert definition to start alert monitoring'}
          title={''}
        ></Placeholder>
      </Paper>
      <CreateAlertDefinitionDrawer
        onClose={onCloseCreateDrawer}
        open={isCreateAlertDefinitionDrawerOpen}
      ></CreateAlertDefinitionDrawer>
    </>
  );
});
