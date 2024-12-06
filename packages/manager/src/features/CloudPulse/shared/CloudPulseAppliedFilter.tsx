import { Box, Chip, Typography } from '@linode/ui';
import React from 'react';

export interface CloudPulseAppliedFilterProps {
  filters: {
    [label: string]: string[];
  };
}
export const CloudPulseAppliedFilter = (
  props: CloudPulseAppliedFilterProps
) => {
  const { filters } = props;

  return (
    <Box
      data-testid="applied-filter"
      display="flex"
      flexDirection={{ sm: 'row', xs: 'column' }}
      flexWrap={{ sm: 'wrap' }}
      maxHeight="70px"
      mb={2}
      mx={3}
      overflow="auto"
      pb={2}
      rowGap={1.5}
    >
      {Object.entries(filters).map((data, index) => {
        const label = data[0];
        const filterValue = data[1];
        return (
          <React.Fragment key={index}>
            <Typography
              fontSize="14px"
              key={label}
              mr={1}
              variant="h3"
            >{`${label}:`}</Typography>
            {filterValue.map((value, index) => {
              return (
                <Chip
                  sx={{
                    backgroundColor: '#f0f7ff',
                    color: '#3d3d42',
                    fontSize: '14px',
                    mr: index === filterValue.length - 1 ? 4 : 1,
                    px: 1,
                    py: 0.5,
                    width: { sm: 'fit-content', xs: '100%' },
                  }}
                  key={`${label} ${value}`}
                  label={value}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </Box>
  );
};
