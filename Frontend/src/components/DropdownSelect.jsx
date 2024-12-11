import React from "react";
import { Autocomplete, TextField } from "../utils/MaterialUI";

const DropdownSelect = ({ options, value, onChange, label, placeholder, style }) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => (
        <li {...props} key={option.title}>
          {option.title}
        </li>
      )}
      inputValue={value}
      onInputChange={(event, newInputValue) => {
        onChange(newInputValue);
      }}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.title : "");
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
        />
      )}
      noOptionsText="" // Ta bort meddelandet "No Options"
      style={style} // Använd style-prop
    />
  );
};

export default DropdownSelect;