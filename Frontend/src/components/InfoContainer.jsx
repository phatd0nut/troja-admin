import React, { useState, useEffect } from "react";
import { Stack, Paper, Divider } from "../utils/MaterialUI";
import FetchUpcomingEvents from "../services/FetchUpcomingEvents";

const InfoContainer = () => {
  const [showDivider, setShowDivider] = useState(true);
  const [pSize, setPSize] = useState(0);
  const [imgSize, setImgSize] = useState(0);
  const [savedSubjects, setSavedSubjects] = useState([]);

  useEffect(() => {
    const subjects = JSON.parse(localStorage.getItem("savedSubjects")) || [];
    setSavedSubjects(subjects);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1154) {
        setShowDivider(false);
        setPSize("0.7rem");
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
          <h2>Biljettstatistik</h2>
          <div className="ticketStats">
            <p>
              Troja Ljungby IF - IK Pantern Ståplats <span>240st</span>
            </p>
            <p>
              Troja Ljungby IF - IK Pantern Ståplats <span>240st</span>
            </p>
            <p>
              Troja Ljungby IF - IK Pantern Ståplats <span>240st</span>
            </p>
            <p>
              Troja Ljungby IF - IK Pantern Ståplats <span>240st</span>
            </p>
          </div>
        </div>
        <div className="infoItem">
          <h2>Senaste mailutskick</h2>
          <div className="latestMail">
            {savedSubjects.length > 0 ? (
              [...savedSubjects]
                .reverse()
                .slice(0, 10)
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
