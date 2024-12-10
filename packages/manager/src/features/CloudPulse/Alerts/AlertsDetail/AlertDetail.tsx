import { Box, Chip, CircleProgress } from '@linode/ui';
import { Grid, styled, useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import EntityIcon from 'src/assets/icons/entityIcons/alert.svg';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { ErrorState } from 'src/components/ErrorState/ErrorState';
import { Placeholder } from 'src/components/Placeholder/Placeholder';
import { useAlertDefinitionQuery } from 'src/queries/cloudpulse/alerts';

import { getAlertBoxStyles } from '../Utils/utils';
import { AlertDetailCriteria } from './AlertDetailCriteria';
import { AlertDetailOverview } from './AlertDetailOverview';

interface RouteParams {
  /**
   * The id of the alert for which the data needs to be shown
   */
  alertId: string;
  /**
   * The service type like linode, dbaas etc., of the the alert for which the data needs to be shown
   */
  serviceType: string;
}

export const AlertDetail = () => {
  const { alertId, serviceType } = useParams<RouteParams>();

  const { data: alertDetails, isError, isFetching } = useAlertDefinitionQuery(
    Number(alertId),
    serviceType
  );

  const generateCrumbOverrides = () => {
    const overrides = [
      {
        label: 'Definitions',
        linkTo: '/monitor/cloudpulse/alerts/definitions',
        position: 1,
      },
      {
        label: 'Details',
        linkTo: `/monitor/cloudpulse/alerts/definitions/details/${serviceType}/${alertId}`,
        position: 2,
      },
    ];

    return { newPathname: '/Definitions/Details', overrides };
  };

  const { newPathname, overrides } = React.useMemo(
    () => generateCrumbOverrides(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const theme = useTheme();

  if (isFetching) {
    return (
      <Grid alignItems="center" container height={theme.spacing(75)}>
        <Grid item xs={12}>
          <CircleProgress />
        </Grid>
      </Grid>
    );
  }

  if (isError) {
    return (
      <Grid alignItems="center" container height={theme.spacing(75)}>
        <Grid item xs={12}>
          <ErrorState
            errorText={
              'An error occurred while loading the definitions. Please try again later.'
            }
          />
        </Grid>
      </Grid>
    );
  }

  if (!alertDetails) {
    return (
      <Grid alignItems="center" container height={theme.spacing(75)}>
        <Grid item xs={12}>
          <StyledPlaceholder icon={EntityIcon} title="No Data to display." />
        </Grid>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Breadcrumb crumbOverrides={overrides} pathname={newPathname} />
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection={{ md: 'row', xs: 'column' }} gap={2}>
          <Box
            flexBasis="100%"
            maxHeight={theme.spacing(98.125)}
            sx={{ ...getAlertBoxStyles(theme), overflow: 'auto' }}
          >
            <AlertDetailOverview alert={alertDetails} />
          </Box>
          <Box
            sx={{
              ...getAlertBoxStyles(theme),
              overflow: 'auto',
            }}
            flexBasis="100%"
            maxHeight={theme.spacing(98.125)}
          >
            <AlertDetailCriteria alert={alertDetails} />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export const StyledAlertChip = styled(Chip, {
  label: 'StyledAlertChip',
  shouldForwardProp: (prop) => prop !== 'borderRadius',
})<{
  borderRadius?: string;
}>(({ borderRadius, theme }) => ({
  '& .MuiChip-label': {
    color: theme.tokens.color.Neutrals.Black,
    marginRight: theme.spacing(1), // Add padding inside the label
  },
  backgroundColor: theme.tokens.color.Neutrals.White,
  borderRadius: borderRadius || 0,
  height: theme.spacing(3),
  lineHeight: '1.5rem',
}));

export const StyledPlaceholder = styled(Placeholder, {
  label: 'StyledPlaceholder',
})(({ theme }) => ({
  h1: {
    fontSize: theme.spacing(2.5),
  },
  h2: {
    fontSize: theme.spacing(2),
  },
  svg: {
    color: 'lightgreen',
    maxHeight: theme.spacing(10.5),
  },
}));
