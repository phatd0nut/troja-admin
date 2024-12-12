import React, { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import Toolbar from "../components/Toolbar";
import CustomerFilter from "../components/CustomerFilter";
import Button from "../components/Button";
import { Typography, SyncIcon } from "../utils/MaterialUI";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState([]);

  return (
    <div className="customersWrapper">
      <Typography variant="h2" className="pageHeader">Kunder</Typography>
      <Toolbar>
        <CustomerFilter
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Button variant="contained" color="primary" endIcon={<SyncIcon/>}>
          Synkronisera kunder
        </Button>
      </Toolbar>
      <CustomerTable
        searchQuery={searchQuery}
        searchCriteria={searchCriteria}
      />
    </div>
  );
};

export default Customers;