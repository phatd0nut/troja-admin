import React from "react";
import { Paper, Box, Typography, TextField } from "../utils/MaterialUI";
import Button from "../components/Button";
import Toolbar from "../components/Toolbar";
import InputFIeld from "../components/InputField";
import DropdownSelect from "../components/DropdownSelect";
import EmailBuilder from "../components/Emailbuilder";

const templateOptions = [
  { value: "1", label: "Mall 1" },
  { value: "2", label: "Mall 2" },
  { value: "3", label: "Mall 3" },
  { value: "4", label: "Mall 4" },
];

const Mailing = () => {
  return (
    <div className="mailingWrapper">
      <Typography variant="h2" className="pageHeader">
        Mailutskick
      </Typography>
      <Toolbar>
        <div id="mailControls">
          <DropdownSelect
            options={templateOptions}
            label={"Välj mall"}
            style={{ width: "200px" }}
          />
          <Button variant="contained" color="primary">
            Skapa ny mall
          </Button>
        </div>
        <Button variant="contained" color="primary">
          Skicka mail
        </Button>
      </Toolbar>
      <Paper elevation={3}>
        <EmailBuilder />
      </Paper>
    </div>
  );
};

export default Mailing;
