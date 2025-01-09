import React, { useEffect, useState } from "react";
import { Typography, SaveIcon } from "../utils/MaterialUI";
import Button from "../components/Button";
import Toolbar from "../components/Toolbar";
import SettingsContainer from "../components/SettingsContainer";
import AvatarIcon from "../components/AvatarIcon"; // Importera AvatarIcon
import "./Settings.css";

const Settings = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Hämta användarnamnet från localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="settingsWrapper">
      <Typography variant="h2" className="pageHeader">
        Inställningar
      </Typography>
      <Toolbar>
        <div id="avatarContainer">
          <AvatarIcon username={username} />
          <div>
          <Typography variant="h6">
            Inloggad som:
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {username}
          </Typography>
          </div>
        </div>
      </Toolbar>
      <SettingsContainer />
    </div>
  );
};

export default Settings;
