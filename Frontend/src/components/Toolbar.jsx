import React from "react";
import { Paper, Box } from "../utils/MaterialUI";

const Toolbar = ({ children }) => {
  return (
    <Paper id="toolbarPaper" elevation={3}>
      <Box className="toolbar">
        {children}
      </Box>
    </Paper>
  );
};

export default Toolbar;