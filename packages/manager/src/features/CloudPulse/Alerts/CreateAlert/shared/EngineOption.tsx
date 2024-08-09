import { useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { useDatabaseEnginesQuery } from 'src/queries/databases';

interface EngineOptionProps {
  name: string;
}
export const EngineOption = (props: EngineOptionProps) => {
  const { data: engineOptions } = useDatabaseEnginesQuery(true);
  const [selectedDatabase, setDatabase] = React.useState<any>('');
  const formik = useFormikContext();

  React.useEffect(() => {
    formik.setFieldValue(`${props.name}`, selectedDatabase.group);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDatabase]);

  const getEnginesList = () => {
    if (engineOptions === undefined) {
      return [];
    }
    return (
      engineOptions &&
      engineOptions.map((option) => {
        return { group: option.engine, label: option.id };
      })
    );
  };

  return (
    <Autocomplete
      onChange={(_: any, newValue, reason) =>
        reason === 'selectOption' && setDatabase(newValue)
      }
      groupBy={(option) => option.group}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      label="Engine Options"
      options={getEnginesList()}
      value={selectedDatabase ? selectedDatabase : null}
    />
  );
};
