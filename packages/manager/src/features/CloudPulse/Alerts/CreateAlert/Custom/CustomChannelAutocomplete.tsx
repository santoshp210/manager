import React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

interface Props {
  handleBlur: (event: any) => void;
  label: string;
  onChange: (value: string) => void;
  options: any[];
  value: any;
}

export const CustomChannelAutocomplete = (Props: Props) => {
  const { handleBlur, label, onChange, options, value } = Props;
  const [customOption, setCustomOption] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState(value);

  const handleChange = (
    e: React.SyntheticEvent<Element, Event>,
    newValue: any,
    operation: string
  ) => {
    e.preventDefault();
    if (!newValue) {
      setSelectedValue('');
      onChange('');
      return;
    }
    if (operation === 'createOption') {
      setSelectedValue(newValue);
      onChange(newValue);
      return;
    }
    setSelectedValue(newValue.value);
    onChange(newValue.value);
  };
  const newOptions =
    customOption &&
    !options.some(
      (obj) =>
        obj.label.toLocaleLowerCase() === customOption.toLocaleLowerCase()
    )
      ? [...options, { label: customOption, value: customOption }]
      : options;

  return (
    <Autocomplete
      onInputChange={(e, v) => {
        if (e) {
          setCustomOption(v);
        }
      }}
      freeSolo
      inputValue={customOption}
      isOptionEqualToValue={(option) => option.value === selectedValue}
      label={label}
      onBlur={handleBlur}
      onChange={handleChange}
      options={newOptions}
      value={selectedValue}
    />
  );
};
