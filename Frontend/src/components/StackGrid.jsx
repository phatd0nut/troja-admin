import React from "react";
import { Stack, Paper, Box, Typography } from "../utils/MaterialUI";

const StackGrid = () => {
  return (
    <Stack
      className="stackGrid"
      direction={{ xs: 'column', sm: 'row', md: 'row'}} // Responsiv direction
      spacing={{ xs: 1, sm: 2, md: 4, lg: 12 }} // Responsiv spacing
    >
      <Box
        sx={{
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Paper className="gridPaperItem" elevation={3}><Typography variant="h4">Ruta 1</Typography><p>Innehåll 1</p></Paper>
      </Box>
      <Box
        sx={{
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Paper className="gridPaperItem" elevation={3}><Typography variant="h4">Ruta 2</Typography><p>Innehåll 2</p></Paper>
      </Box>
      <Box
        sx={{
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Paper className="gridPaperItem" elevation={3}><Typography variant="h4">Ruta 3</Typography><p>Innehåll 3</p></Paper>
      </Box>
    </Stack>
  );
};

export default StackGrid;