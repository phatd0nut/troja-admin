import React from "react";
import { Stack, Paper, Divider } from "../utils/MaterialUI"; // Importera Box, Paper, Stack och Typography korrekt

import trjLogo from "../assets/img/trj.png"; // Importera bilden korrekt
import panternLogo from "../assets/img/IK_Pantern_logo.png"; // Importera bilden korrekt

const InfoContainer = () => {
  return (
    <Paper className="infoContainer" elevation={3}>
      <Stack
        spacing={8}
        direction={{ sm: "column", md: "row" }}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ flexWrap: "wrap", width: "100%" }}
      >
        <div className="infoItem">
          <h2>Nästkommande matcher</h2>
          <div className="nextMatch">
            <img src={trjLogo} />
            <div className="nextMatchPDiv">
              <p>Fredag den 6 december</p>
              <p>19:00</p>
              <p>Ljungby Arena</p>
            </div>
            <img src={panternLogo} />
          </div>
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
            <p>Mailutskick 1</p>
            <p>Mailutskick 2</p>
            <p>Mailutskick 3</p>
            <p>Mailutskick 4</p>
          </div>
        </div>
      </Stack>
    </Paper>
  );
};

export default InfoContainer;
