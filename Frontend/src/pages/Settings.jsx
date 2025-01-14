import React, { useEffect, useState } from "react";
import { Typography } from "../utils/MaterialUI";
import Toolbar from "../components/Toolbar";
import SettingsContainer from "../components/SettingsContainer";
import AvatarIcon from "../components/AvatarIcon"; // Importera AvatarIcon
import "./Settings.css";

/**
 * Komponent för inställningssidan.
 *
 * @component Settings
 * @returns {JSX.Element} JSX-element som representerar inställningssidan.
 *
 * @example
 * return <Settings />
 *
 * @description
 * Denna komponent hanterar visningen av inställningssidan. Den hämtar användarnamnet från localStorage
 * och visar det tillsammans med en avatar och andra inställningsalternativ.
 *
 * @function
 * @name Settings
 *
 * @returns {JSX.Element} - JSX-element som representerar inställningssidan.
 *
 * @example
 * <Settings />
 *
 * @hook
 * @name useState
 * @description Hook för att hantera komponentens tillstånd.
 * @param {string} username - Användarnamnet som hämtas från localStorage.
 * @param {function} setUsername - Funktion för att uppdatera användarnamnet.
 *
 * @hook
 * @name useEffect
 * @description Hook för att hämta användarnamnet från localStorage när komponenten laddas.
 *
 * @component
 * @name Typography
 * @description Komponent från Material-UI för att hantera typografi.
 *
 * @component
 * @name Toolbar
 * @description Komponent från Material-UI för att hantera verktygsfält.
 *
 * @component
 * @name AvatarIcon
 * @description Komponent för att visa användarens avatar.
 * @param {string} username - Användarnamnet som skickas till AvatarIcon-komponenten.
 *
 * @component
 * @name SettingsContainer
 * @description Komponent för att visa inställningsalternativ.
 */
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
