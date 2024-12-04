import { Button, Stack, Typography } from '@linode/ui';
import { Box } from '@linode/ui';
import React from 'react';
import { FieldPathByValue, useFieldArray, useFormContext } from 'react-hook-form';

import { DimensionFilterField } from './DimensionFilterField';

import type { Dimension, DimensionFilter } from '@linode/api-v4';
import { CreateAlertDefinitionForm } from '../types';

interface DimensionFilterProps {
  /**
   * dimension filter data for the selected metric
   */
  dimensionOptions: Dimension[];
  /**
   * name used for the component to set formik field
   */
  name: FieldPathByValue<CreateAlertDefinitionForm, DimensionFilter[]>;
}
export const DimensionFilter = (props: DimensionFilterProps) => {
  const { dimensionOptions, name } = props;
  const { control } = useFormContext<CreateAlertDefinitionForm>();

  const { append, fields, remove } = useFieldArray({
    control,
    name,
  });
  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing(2) })}>
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
          {fields.map((_, index) => (
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
            append({
              dimension_label: '',
              operator: '',
              value: '',
            })
          }
          buttonType="secondary"
          compactX={true}
          size="small"
          sx={(theme) => ({ marginTop: theme.spacing(1) })}
        >
          Add dimension filter
        </Button>
      </>
    </Box>
  );
};
