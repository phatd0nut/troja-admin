import React, { useState } from "react";
import { Box } from "@mui/material";
import DropdownSelect from "./DropdownSelect";
import InputField from "../components/InputField";

const searchOptions = [
  { title: "Namn" },
  { title: "Email" },
  { title: "Telefon" },
  { title: "Adress" },
  { title: "Postnummer" },
  { title: "Stad" },
  { title: "Poäng" },
  { title: "Nyhetsbrev" },
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

  const handleFilterChange = (newValue) => {
    setSearchCriteria(newValue ? [newValue] : []);
    setFilterValue(newValue ? newValue : ""); // Uppdatera filterValue när ett nytt kriterium väljs
    if (!newValue) {
      setSearchQuery(""); // Rensa searchQuery när inget kriterium är valt
    }
  };

  return (
    <Box id="customerFilter">
      <DropdownSelect
        options={searchOptions}
        value={filterValue}
        onChange={handleFilterChange}
        label="Välj kriterier"
        placeholder="Välj kriterier"
        style={{ width: 200 }}
      />
      <InputField
        label={searchCriteria.length > 0 ? `Sök kunder efter ${searchCriteria[0]}` : "Välj filtreringskriterium"}
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: 400 }}
        disabled={searchCriteria.length === 0} // Inaktivera InputField om inget kriterium har valts
      />
    </Box>
  );
};

export default CustomerFilter;