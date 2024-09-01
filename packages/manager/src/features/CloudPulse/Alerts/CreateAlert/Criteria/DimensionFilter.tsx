import { Box } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import React from 'react';

import { Button } from 'src/components/Button/Button';
import { Stack } from 'src/components/Stack';
import { Typography } from 'src/components/Typography';

import { DimensionFilterField } from './DimensionFilterField';

import type { Dimension } from '@linode/api-v4';

interface DimensionFilterProps {
  /**
   * dimension filter data for the selected metric
   */
  dimensionOptions: Dimension[];
  /**
   * name used for the component to set formik field
   */
  name: string;
}
export const DimensionFilter = (props: DimensionFilterProps) => {
  const { dimensionOptions, name } = props;
  const formik = useFormikContext();

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing(2) })}>
      <FieldArray name={name}>
        {({ push, remove }) => (
          <>
            <Box
              alignItems={'center'}
              display={'flex'}
              justifyContent={'space-between'}
            >
              <Typography variant={'h3'}>
                Dimension Filter{' '}
                <Typography component="span"> (optional)</Typography>
              </Typography>
            </Box>

            <Stack spacing={2}>
              {formik
                .getFieldProps(name)
                .value.map((_: typeof DimensionFilter, index: number) => (
                  <DimensionFilterField
                    dimensionOptions={dimensionOptions}
                    key={index}
                    name={`${name}[${index}]`}
                    onFilterDelete={() => remove(index)}
                  />
                ))}
            </Stack>
            <Button
              onClick={() =>
                push({
                  dimension_label: '',
                  operator: '',
                  value: '',
                })
              }
              buttonType="secondary"
              size="small"
              sx={(theme) => ({ marginTop: theme.spacing(1) })}
            >
              Add Dimension Filter
            </Button>
          </>
        )}
      </FieldArray>
    </Box>
  );
};
