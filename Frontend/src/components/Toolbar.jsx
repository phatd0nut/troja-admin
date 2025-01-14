import React from "react";
import { Paper, Box } from "../utils/MaterialUI";

/**
 * @component Toolbar
 * @description En komponent som representerar en verktygsfält.
 * @param {Object} props - Komponentens props.
 * @param {React.ReactNode} props.children - Innehållet som ska visas inom verktygsfältet.
 * @returns {JSX.Element} En Paper-komponent som innehåller en Box med verktygsfältets innehåll.
 * @example
 * <Toolbar>
 *   <Button>Click me</Button>
 * </Toolbar>
 */
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