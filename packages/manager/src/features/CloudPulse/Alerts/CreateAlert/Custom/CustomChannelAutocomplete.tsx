import React from "react";
import { Autocomplete } from "src/components/Autocomplete/Autocomplete";

interface Props  {
  options: any[];
  value: any;
  onChange: any;
  label: string;
}

export const CustomChannelAutocomplete = (Props : Props) => {
  const { options, value, label, onChange} = Props;
  const [customOption, setCustomOption] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState(value);

  const handleChange = (_ : any, newValue : any, operation : string) => {
    if(!newValue){
      setSelectedValue("");
      onChange("");
      return;
    }
    if(operation === 'createOption'){
      setSelectedValue(newValue);
      onChange(newValue);
      return;
    }
    setSelectedValue(newValue.value);
    onChange(newValue.value);
  };
  const newOptions = customOption && !options.some((obj) => obj.label.toLocaleLowerCase().startsWith(customOption.toLocaleLowerCase()) ) ? [...options, { label: customOption, value: customOption}] : options;

  return (
    <>
      <Autocomplete 
        options={newOptions}
        value={selectedValue}
        onChange={handleChange}
        label={label}
        freeSolo
        inputValue={customOption}
        onInputChange={(e,v) => {
          if(e) setCustomOption(v);
        }}
        isOptionEqualToValue={(option) => option.value === selectedValue}
      />

    </>
  )
}