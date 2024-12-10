import React, { useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";

const searchOptions = [
  { title: "Namn" },
  { title: "Adress" },
  { title: "Postnummer" },
  { title: "Stad" },
  { title: "Telefon" },
  { title: "Email" },
  // Lägg till fler sökalternativ här
];

const CustomerFilter = ({
  searchCriteria,
  setSearchCriteria,
  searchQuery,
  setSearchQuery,
}) => {
  const [filterValue, setFilterValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event, newValue) => {
    setSearchCriteria(newValue ? [newValue.title] : []);
    setFilterValue(""); // Rensa filterValue när ett nytt kriterium väljs
    setSearchQuery(""); // Rensa sökfältet när ett nytt kriterium väljs
  };

  return (
    <Box id="customerFilter">
      <Autocomplete
        options={searchOptions}
        getOptionLabel={(option) => option.title}
        renderOption={(props, option) => (
          <li {...props} key={option.title}>
            {option.title}
          </li>
        )}
        style={{ width: 200 }}
        inputValue={filterValue} // Använd filterValue för att visa det valda filtret
        onInputChange={(event, newInputValue) => {
          setFilterValue(newInputValue); // Uppdatera filterValue när användaren skriver
        }}
        onChange={handleFilterChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Välj kriterier"
            placeholder="Välj kriterier"
          />
        )}
        noOptionsText="" // Ta bort meddelandet "No Options"
      />
      <TextField
        label={searchCriteria.length > 0 ? `Sök kunder efter ${searchCriteria[0]}` : "Sök"}
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: 400 }}
      />
    </Box>
  );
};

export default CustomerFilter;