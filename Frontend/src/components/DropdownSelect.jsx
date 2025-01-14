import React from "react";
import { Autocomplete, TextField } from "../utils/MaterialUI";

/**
 * @component DropdownSelect
 * @description DropdownSelect-komponenten är en anpassad dropdown med autocomplete-funktionalitet.
 *
 * @param {Object[]} options - En array av objekt som representerar alternativen i dropdownen.
 * @param {string} value - Det nuvarande värdet som är valt i dropdownen.
 * @param {function} onChange - En callback-funktion som anropas när värdet ändras.
 * @param {string} label - Etiketten som visas ovanför textfältet.
 * @param {string} placeholder - Platshållartexten som visas i textfältet när inget värde är valt.
 * @param {Object} style - Ett objekt som innehåller CSS-stilar för komponenten.
 *
 * @returns {JSX.Element} En Autocomplete-komponent med anpassade renderingsalternativ.
 */
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
      style={style} 
    />
  );
};

export default DropdownSelect;