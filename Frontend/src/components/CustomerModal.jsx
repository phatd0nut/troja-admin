import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  Divider,
  CloseIcon,
  List,
  ListItem,
  ListItemText,
} from "../utils/MaterialUI";
import Button from "./Button";
import { fetchCustomerPurchases } from "../services/customerService";
import { useEffect, useState } from "react";

/**
 * @description CustomerModal är en React-komponent som visar en modal med kundinformation och deras senaste köp.
 * 
 * @component CustomerModal
 * @param {Object} props - Komponentens props.
 * @param {Object} props.customer - Kundobjektet som innehåller kundens information.
 * @param {Function} props.onClose - Funktion som anropas när modalen stängs.
 * @param {Object} ref - Referens till modalens DOM-element.
 * 
 * @returns {JSX.Element|null} Returnerar en JSX-element som representerar modalen eller null om ingen kund är tillgänglig.
 * 
 * @example
 * // Exempel på användning av CustomerModal
 * <CustomerModal customer={customerData} onClose={handleClose} ref={modalRef} />
 */
const CustomerModal = forwardRef(({ customer, onClose }, ref) => {
  if (!customer) return null;

  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (customer) {
      const getPurchases = async () => {
        try {
          const data = await fetchCustomerPurchases(customer.userRefNo);
          console.log(data);
          
          setPurchases(data);
        } catch (error) {
          console.error("Error fetching purchases:", error);
        }
      };
      getPurchases();
    }
  }, [customer]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box
  ref={ref}
  tabIndex={-1}
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    minWidth: 800,
    minHeight: 600,
    maxHeight: "80vh", // Add max height constraint
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    outline: "none",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden" // Prevent overflow
  }}
>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" color="primary">
          {customer.firstName} {customer.lastName} ({customer.points} poäng)
        </Typography>
        <Button
          onClick={onClose}
          variant="text"
          color="secondary"
          endIcon={<CloseIcon />}
          sx={{
            "& .MuiButton-endIcon": {
              margin: 0,
              padding: 0,
            },
          }}
        />
      </Box>
      <Typography sx={{ mt: 2 }}>Email: {customer.email}</Typography>
      <Typography sx={{ mt: 2 }}>Telefon: {customer.phoneNumber}</Typography>
      <Typography sx={{ mt: 2 }}>Adress: {customer.postalAddress}</Typography>
      <Typography sx={{ mt: 2 }}>Postnummer: {customer.zipcode}</Typography>
      <Typography sx={{ mt: 2 }}>
        Stad: {capitalizeFirstLetter(customer.city)}
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Företagskund: {customer.isCompany === 1 ? "Ja" : "Nej"}
      </Typography>
      {customer.isCompany === 1 && (
        <Typography sx={{ mt: 2 }}>
          Företagsnamn: {customer.companyName}
        </Typography>
      )}
      <Typography sx={{ mt: 2 }}>
        Nyhetsbrev: {customer.acceptInfo === 1 ? "Ja" : "Nej"}
      </Typography>
      <Divider sx={{ mt: 4 }} />
      <Box sx={{ 
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}>
        <Typography variant="h4" color="primary" sx={{ mt: 2, mb: 2 }}>
          Senaste köp
        </Typography>
        <List sx={{ 
          overflow: 'auto',
          width: '100%',
          '& .MuiListItem-root': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
          }
        }}>
          {purchases.map((purchase, index) => (
            <ListItem
              key={`purchase-${index}`}
              sx={{ py: 1, pl: 0 }}
            >
              <ListItemText
                primary={purchase.goodsName}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      {new Date(purchase.createdDateUTC).toLocaleDateString("sv-SE")}
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ ml: 2 }}>
                      Pris: {purchase.priceAfterVat} kr
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
});

export default CustomerModal;
