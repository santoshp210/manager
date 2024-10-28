import { Alert } from '@linode/api-v4';
import * as React from 'react';
import { DateTimeDisplay } from 'src/components/DateTimeDisplay';

import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { Typography } from 'src/components/Typography';
import { capitalize } from 'src/utilities/capitalize';

// import { AlertActionMenu } from './AlertActionMenu';

// import type { ActionHandlers } from './AlertActionMenu';

interface Props {
  alert: Alert;
  //   handlers: ActionHandlers;
}

export const AlertTableRow = React.memo((props: Props) => {
  const { alert } = props;
  return (
    <TableRow data-qa-alert-cell={alert.id} key={`alert-row-${alert.id}`}>
      <TableCell colSpan={2}>{alert.name}</TableCell>
      <TableCell>{capitalize(alert.service_type)}</TableCell>
      <TableCell>{alert.severity}</TableCell>
      <TableCell>
        <Typography color={alert.status === 'Enabled' ? 'limegreen' : 'gray'}>
          {alert.status}
        </Typography>
      </TableCell>
      <TableCell>
        <DateTimeDisplay value={alert.updated} />
      </TableCell>
      <TableCell>{alert.created_by}</TableCell>
      {/* <TableCell actionCell>
        <AlertActionMenu alert={alert} handlers={handlers} />
      </TableCell> */}
    </TableRow>
  );
});
