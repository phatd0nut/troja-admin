import React, { useState, useEffect } from "react";
import { Stack, Paper, Divider } from "../utils/MaterialUI";
import FetchUpcomingEvents from "../services/FetchUpcomingEvents";
import { fetchTicketCounts } from "../services/customerService";

/**
 * @component InfoContainer
 * @description InfoContainer-komponenten hanterar och visar information om nästkommande matcher,
 * flest köpta biljetter och senaste mailutskick. Den använder flera useState-krokar
 * för att hantera komponentens tillstånd och useEffect-krokar för att ladda data
 * och hantera fönsterstorleksändringar.
 *
 * @example
 * return (
 *   <InfoContainer />
 * )
 *
 * @returns {JSX.Element} En React-komponent som visar information i ett papperskort med staplade element.
 */
const InfoContainer = () => {
  const [showDivider, setShowDivider] = useState(true);
  const [pSize, setPSize] = useState(0);
  const [imgSize, setImgSize] = useState(0);
  const [savedSubjects, setSavedSubjects] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);

  useEffect(() => {
    const subjects = JSON.parse(localStorage.getItem("savedSubjects")) || [];
    setSavedSubjects(subjects);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1154) {
        setShowDivider(false);
        setPSize("0.8rem");
        setImgSize("50px");
      } else if (window.innerWidth < 1581) {
        setShowDivider(false);
        setPSize("0.8rem");
        setImgSize("75px");
      } else {
        setShowDivider(true);
        setPSize("1.2rem");
        setImgSize("100px");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Kör funktionen en gång vid montering

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const data = await fetchTicketCounts();
        const purchases = Object.entries(data.purchaseCounts).map(
          ([email, info]) => ({
            email,
            name: `${info.firstName} ${info.lastName}`,
            tickets: info.purchases.Ticket || 0,
          })
        );
        setRecentPurchases(purchases);
      } catch (error) {
        console.error("Error loading purchases:", error);
      }
    };
    loadPurchases();
  }, []);

  return (
    <Paper
      className="infoContainer"
      elevation={3}
      sx={{ overflow: "auto", minHeight: "50%", fontSize: pSize }}
    >
      <Stack
        spacing={8}
        direction={{ sm: "column", md: "row" }}
        divider={
          showDivider ? <Divider orientation="vertical" flexItem /> : null
        }
        sx={{ flexWrap: "wrap", width: "100%" }}
      >
        <div className="infoItem">
          <h2>Nästkommande matcher</h2>
          <FetchUpcomingEvents imgSize={imgSize} />
        </div>
        <div className="infoItem">
          <h2>Flest köpta biljetter</h2>
                  <div className="purchaseStats">
            {recentPurchases
              .filter(purchase => purchase.tickets > 0)
              .sort((a, b) => b.tickets - a.tickets)
              .slice(0, 16)
              .map((purchase, index) => (
                <p key={index}>
                  {purchase.name} <span>{purchase.tickets}st</span>
                </p>
              ))}
          </div>
        </div>
        <div className="infoItem">
          <h2>Senaste mailutskick</h2>
          <div className="latestMail">
            {savedSubjects.length > 0 ? (
              [...savedSubjects]
                .reverse()
                .slice(0, 16)
                .map((subject, index) => <p key={index}>{subject}</p>)
            ) : (
              <p>Inga tidigare mailutskick</p>
            )}
          </div>
        </div>
      </Stack>
    </Paper>
  );
};

export default InfoContainer;
