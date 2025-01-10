import React, { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import Toolbar from "../components/Toolbar";
import CustomerFilter from "../components/CustomerFilter";
import Button from "../components/Button";
import LoadingCircle from "../components/LoadingCircle";
import { 
  Typography, 
  SyncIcon, 
  Dialog, 
  DialogContent,
} from "../utils/MaterialUI";
import { triggerFetchData } from "../services/customerService";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCloseDialog = () => {
    setMessage("");
    window.location.reload(); // Reload page when dialog closes
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setMessage("Synkroniserar kunder...");
      await triggerFetchData();
      setMessage("Synkronisering slutförd!");
    } catch (error) {
      setMessage("Ett fel uppstod vid synkronisering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customersWrapper">
      <Typography variant="h2" className="pageHeader">
        Kunder
      </Typography>
      <Toolbar>
        <CustomerFilter
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SyncIcon />}
          onClick={handleSync}
          disabled={loading}
        >
          Synkronisera kunder
        </Button>
      </Toolbar>
      <CustomerTable
        searchQuery={searchQuery}
        searchCriteria={searchCriteria}
      />
      <Dialog open={loading || message !== ""} onClose={handleCloseDialog}>
        <DialogContent className="standardDialog">
          <h2>{message}</h2>
          {loading && <LoadingCircle />}
          {!loading && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseDialog}
            >
              Stäng
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;