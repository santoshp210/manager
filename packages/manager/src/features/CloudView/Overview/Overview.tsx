import * as React from 'react';

import { Divider } from 'src/components/Divider';
import { LandingHeader } from 'src/components/LandingHeader/LandingHeader';
import { Paper } from 'src/components/Paper';
  return (
    <Paper>
      <LandingHeader breadcrumbProps={{ pathname: '/Metrics Visualization' }} />
      <Divider orientation="horizontal"></Divider>      
      <Dashboard/>      
    </Paper>
  );
});
