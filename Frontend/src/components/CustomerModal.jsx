import React, { forwardRef } from "react";
import { Box, Typography, Divider } from "../utils/MaterialUI";
import Button from "./Button";

const CustomerModal = forwardRef(({ customer, onClose }, ref) => {
  if (!customer) return null;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box
      ref={ref}
      tabIndex={-1} // Används för att kunna använda esc för att stänga modalen
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "80%",
        minWidth: 800,
        minHeight: 600,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        outline: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Typography variant="h4" color="primary">
          {customer.firstName} {customer.lastName} ({customer.points} poäng)
        </Typography>
        <Button onClick={onClose} variant="contained" color="primary">
          Stäng
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }}>Email: {customer.email}</Typography>
      <Typography sx={{ mt: 2 }}>Telefon: {customer.phoneNumber}</Typography>
      <Typography sx={{ mt: 2 }}>Adress: {customer.postalAddress}</Typography>
      <Typography sx={{ mt: 2 }}>Postnummer: {customer.zipcode}</Typography>
      <Typography sx={{ mt: 2 }}>Stad: {capitalizeFirstLetter(customer.city)}</Typography>
      <Typography sx={{ mt: 2 }}>
        Företagskund: {customer.isCompany === 1 ? "Ja" : "Nej"}
      </Typography>
      {customer.isCompany === 1 && (
        <Typography sx={{ mt: 2 }}>Företagsnamn: {customer.companyName}</Typography>
      )}
      <Typography sx={{ mt: 2 }}>
        Nyhetsbrev: {customer.acceptInfo === 1 ? "Ja" : "Nej"}
      </Typography>
      <Divider sx={{ mt: 4 }} />
      <Typography variant="h4" color="primary" sx={{ mt: 4 }}>
        Senaste köp
      </Typography>
    </Box>
  );
});

export default CustomerModal;