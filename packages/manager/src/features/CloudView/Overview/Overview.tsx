import * as React from 'react';

import CloudViewIcon from 'src/assets/icons/entityIcons/cv_overview.svg';
import { Divider } from 'src/components/Divider';
import { LandingHeader } from 'src/components/LandingHeader/LandingHeader';
import { Paper } from 'src/components/Paper';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useDashboards } from 'src/queries/cloudview/dashboards';

import { GlobalFilters } from './GlobalFilters';

export const Overview = React.memo(() => {
  const { data: dashboards, isError, isLoading } = useDashboards();
  if (isLoading) {
    // eslint-disable-next-line no-console
    console.log('data is loading');
  }
  if (!dashboards || isError) {
    // eslint-disable-next-line no-console
    console.log('data fetching error');
  }
  // eslint-disable-next-line no-console
  console.log('the dashboard data: ', dashboards);
  return (
    <Paper>
      <LandingHeader breadcrumbProps={{ pathname: '/Metrics Visualization' }} />
      <Divider orientation="horizontal"></Divider>
      <GlobalFilters></GlobalFilters>
      <Placeholder
        subtitle="No visualizations are available at this moment.
        Apply filters to view charts"
        icon={CloudViewIcon}
        title=""
      />
    </Paper>
  );
});
