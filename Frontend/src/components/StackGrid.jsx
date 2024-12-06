import React from "react";
import { Stack, Paper, Box } from "../utils/MaterialUI"; // Importera Stack, Divider, Paper och Box korrekt

const StackGrid = ({ isDrawerOpen }) => {
  const marginValue = isDrawerOpen ? 6 : 8;

  return (

      <Stack
        className="stackGrid"
        direction="row"
        spacing={0} // Sätt spacing till 0 och hantera spacing med margin på Box
      >
        <Box
          sx={{
            transition: "margin 0.3s ease-in-out",
            marginRight: `${marginValue}%`,
            marginLeft: `${marginValue}%`,
            display: 'flex',
          }}
        >
          <Paper className="gridPaperItem"><h3>Ruta 1</h3><p>Innehåll 1</p></Paper>
        </Box>
        <Box
          sx={{
            transition: "margin 0.3s ease-in-out",
            marginRight: `${marginValue}%`,
            display: 'flex',
          }}
        >
          <Paper className="gridPaperItem"><h3>Ruta 2</h3><p>Innehåll 2</p></Paper>
        </Box>
        <Box
          sx={{
            transition: "margin 0.3s ease-in-out",
            display: 'flex',
            marginRight: `${marginValue}%`,
          }}
        >
          <Paper className="gridPaperItem"><h3>Ruta 3</h3><p>Innehåll 3</p></Paper>
        </Box>
      </Stack>

  );
};

export default StackGrid;