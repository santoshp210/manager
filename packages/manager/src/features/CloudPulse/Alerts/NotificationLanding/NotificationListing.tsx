import { Grid, TableBody, TableHead } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { DebouncedSearchTextField } from 'src/components/DebouncedSearchTextField';
import { Table } from 'src/components/Table';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';

import { DeleteNotificationDialog } from './DeleteNotificationDialog';
import { NotificationTableRow } from './NotificationTableRow';

import type { AlertNotification } from '@linode/api-v4';
import type { Order } from 'src/hooks/useOrder';
interface NotificationProps {
  error: any;
  handleOrderChange: (newOrderBy: string, newOrder: Order) => void;
  // handleSelect: (notification: any) => void;
  isLoading: boolean;
  notifications: AlertNotification[];
  onSearch: (text: string) => void;
  order: Order;
  orderBy: string;
  searchText: string;
}

const stausFilterOptions = [
  {
    label: 'All Types',
    value: 'AllTypes',
  },
  {
    label: 'Email',
    value: 'Email',
  },
];

export const NotificationListing = (props: NotificationProps) => {
  const {
    error,
    handleOrderChange,
    isLoading,
    notifications,
    onSearch,
    order,
    orderBy,
    searchText,
  } = props;
  const [selectedNotification, setSelectedNotification] = React.useState<AlertNotification | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<any>({
    label: 'All Types',
    value: 'AllTypes',
  });
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const history = useHistory();
  const handleShowDelete = (notification: AlertNotification) => {
    setSelectedNotification(notification);
    setShowDeleteDialog(true);
  };
  const handleDetails = (notification: AlertNotification) => {
    history.replace(
      `/monitor/cloudpulse/alerts/notifications/details/${notification.id}`
    );
  };

  const onStausFilterChange = (val, operation: string) => {
    if (operation === 'selectOption') {
      setStatusFilter(val);
    } else {
      setStatusFilter({
        label: 'All Types',
        value: 'AllTypes',
      });
    }
  };
  return (
    <>
      <Grid container spacing={1}>
        <Grid item marginTop={1} md={3} xs={12}>
          <DebouncedSearchTextField
            debounceTime={400}
            hideLabel={true}
            isSearching={false}
            label={' '}
            onSearch={onSearch}
            placeholder="Search for Channels"
            value={searchText}
          />
        </Grid>
        <Grid item md={3} padding={0} xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onChange={(_, val, operation) =>
              onStausFilterChange(val, operation)
            }
            label=""
            noMarginTop
            options={stausFilterOptions}
            value={statusFilter ?? []}
          />
        </Grid>
      </Grid>
      <Grid marginTop={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableSortCell
                active={orderBy === 'channelName'}
                colSpan={2}
                direction={order}
                handleClick={handleOrderChange}
                label="channelName"
              >
                Channel Name
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'type'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="type"
              >
                Type
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'lastModified'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="lastModified"
              >
                Last modified
              </TableSortCell>
              <TableSortCell
                active={orderBy === 'size'}
                colSpan={1}
                direction={order}
                handleClick={handleOrderChange}
                label="size"
              >
                Created by
              </TableSortCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification: AlertNotification) => (
              <NotificationTableRow
                handlers={{
                  handleDelete: () => handleShowDelete(notification),
                  handleDetails: () => handleDetails(notification),
                }}
                key={notification.id}
                notification={notification}
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
      <DeleteNotificationDialog
        notification={selectedNotification}
        onClose={() => setShowDeleteDialog(false)}
        open={showDeleteDialog}
      />
    </>
  );
};
