import React, { useState } from "react";
import { Box } from "@mui/material";
import DropdownSelect from "./DropdownSelect";
import InputField from "../components/InputField";

// Alternativ för sökkriterier
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

// CustomerFilter-komponenten hanterar sökfiltrering för kundtabellen
/**
 * @description Komponent för att filtrera kunder baserat på sökkriterier och sökfråga.
 *
 * @component CustomerFilter
 * @param {Object} props - Komponentens props.
 * @param {Array} props.searchCriteria - Nuvarande sökkriterium.
 * @param {Function} props.setSearchCriteria - Funktion för att uppdatera sökkriterium.
 * @param {string} props.searchQuery - Nuvarande sökfråga.
 * @param {Function} props.setSearchQuery - Funktion för att uppdatera sökfråga.
 *
 * @returns {JSX.Element} JSX-element som representerar kundfilterkomponenten.
 */
const CustomerFilter = ({
  searchCriteria,    // Nuvarande sökkriterium
  setSearchCriteria, // Funktion för att uppdatera sökkriterium
  searchQuery,       // Nuvarande sökfråga
  setSearchQuery,    // Funktion för att uppdatera sökfråga
}) => {
  const [filterValue, setFilterValue] = useState(""); // Lokalt state för valt filter

  // Hantera ändring av sökfråga
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Hantera ändring av filterkriterium
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