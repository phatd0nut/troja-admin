import React, { useState, useEffect } from "react";
import { Stack, Paper, Box, Typography } from "../utils/MaterialUI";
import { fetchPurchaseDetails } from "../services/customerService";

/**
 * @component StackGrid
 * @description En komponent som visar försäljningsdata och toppkund för föregående månad.
 *
 * @example
 * <StackGrid />
 *
 * @function
 * @returns {JSX.Element} En JSX-element som innehåller tre rutor med försäljningsdata.
 *
 * @description
 * StackGrid-komponenten hämtar och visar försäljningsdata och toppkund för föregående månad.
 * Den använder useState för att hantera tillstånd och useEffect för att ladda data vid komponentens montering.
 *
 * @description
 * Komponentens layout består av tre rutor:
 * 1. Försäljning föregående månad: Visar den totala försäljningen för föregående månad.
 * 2. Toppkund förra månaden: Visar den kund som spenderade mest under föregående månad.
 * 3. Ruta 3: En plats för ytterligare innehåll.
 *
 * @description
 * Om data laddas visas en laddningsindikator. Om ett fel uppstår visas ett felmeddelande.
 *
 * @description
 * Försäljningsdata filtreras för att ta bort köp med nollpris och dubbletter baserat på crmId.
 * Den totala försäljningen och toppkunden beräknas baserat på de unika köpen.
 */
const StackGrid = () => {
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [topCustomer, setTopCustomer] = useState(null);

  useEffect(() => {
    const loadPurchaseDetails = async () => {
      try {
        const data = await fetchPurchaseDetails();
        setPurchaseDetails(data);

        // Filtrera bort köp med nollpris och ta bort dubbletter baserat på crmId (unika köp)
        const validPurchases = data.filter(
          (purchase) => purchase.price !== "0.00"
        );
        const uniquePurchases = validPurchases.reduce((acc, purchase) => {
          if (!acc[purchase.crmId]) {
            acc[purchase.crmId] = purchase;
          }
          return acc;
        }, {});

        // Beräkna total försäljning förra månaden (summa av alla unika köp)
        const totalSalesAmount = Object.values(uniquePurchases).reduce(
          (sum, purchase) => sum + parseFloat(purchase.price),
          0
        );
        setTotalSales(totalSalesAmount);

        // Beräkna total försäljning per kund (summa av alla unika köp per kund)
        const customerTotals = Object.values(uniquePurchases).reduce(
          (acc, purchase) => {
            const key = purchase.userRefNo;
            if (!acc[key]) {
              acc[key] = {
                firstName: purchase.firstName,
                lastName: purchase.lastName,
                total: parseFloat(purchase.price),
              };
            }
            return acc;
          },
          {}
        );

        // Hitta kunden som spenderade mest förra månaden (toppkund)
        const topSpender = Object.entries(customerTotals).sort(
          ([, a], [, b]) => b.total - a.total
        )[0];

        setTopCustomer(
          topSpender
            ? {
                name: `${topSpender[1].firstName} ${topSpender[1].lastName}`,
                total: topSpender[1].total,
              }
            : null
        );
      } catch (err) {
        setError(err.message);
        console.error("Error loading purchase details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseDetails();
  }, []);

  return (
    <Stack
      className="stackGrid"
      direction={{ xs: "column", sm: "row", md: "row" }}
      spacing={{ xs: 1, sm: 2, md: 4, lg: 12 }}
    >
      {/* First Box - Total Sales */}
      <Box sx={{ transition: "margin 0.3s ease-in-out" }}>
        <Paper className="gridPaperItem" elevation={3}>
          <Typography variant="h5">Försäljning föregående månad</Typography>
          {loading ? (
            <Typography>Laddar...</Typography>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <Typography variant="h6">
              {totalSales.toLocaleString("sv-SE", {
                style: "currency",
                currency: "SEK",
                maximumFractionDigits: 0,
              })}
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Second Box - Top Customer */}
      <Box sx={{ transition: "margin 0.3s ease-in-out" }}>
        <Paper className="gridPaperItem" elevation={3}>
          <Typography variant="h5">Toppkund förra månaden</Typography>
          {loading ? (
            <Typography>Laddar...</Typography>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : topCustomer ? (
            <>
              <Typography variant="h6">
                {topCustomer.name}{" "}
                ({Math.round(topCustomer.total).toLocaleString("sv-SE", {
                  style: "currency",
                  currency: "SEK",
                  maximumFractionDigits: 0,
                })})
              </Typography>
            </>
          ) : (
            <Typography>Ingen data tillgänglig</Typography>
          )}
        </Paper>
      </Box>

      {/* Third Box */}
      <Box sx={{ transition: "margin 0.3s ease-in-out" }}>
        <Paper className="gridPaperItem" elevation={3}>
          <Typography variant="h5">Ruta 3</Typography>
          <p>Innehåll 3</p>
        </Paper>
      </Box>
    </Stack>
  );
};

export default StackGrid;
