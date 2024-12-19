import React, { useState } from "react";
import {
  Stack,
  Paper,
  Divider,
  Typography,
  SaveIcon,
  Switch,
} from "../utils/MaterialUI";
import InputField from "./InputField";
import Button from "./Button";
import MaintenanceClock from "./MaintenanceClock";

const SettingsContainer = () => {
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSaveChanges = () => {
    // Implementera logik för att spara ändringar
    console.log("Spara ändringar:", {
      newUsername,
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <Paper className="settingsContainer" elevation={3}>
      <Stack
        divider={<Divider orientation="vertical" flexItem />}
        sx={{
          width: "100%",
          height: "100%",
          minWidth: "80%",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <div className="settingsItem" style={{ alignItems: "flex-start" }}>
          <Typography variant="h5" sx={{ marginBottom: "16px" }}>
            Kontoinställningar
          </Typography>
          <InputField
            id="new-username"
            label="Nytt användarnamn"
            type="text"
            value={newUsername}
            onChange={handleUsernameChange}
            autoComplete="username"
          />
          <Divider sx={{ width: "342px", my: 2 }} />
          <InputField
            id="current-password"
            label="Nuvarande lösenord"
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            autoComplete="current-password"
          />
          <InputField
            id="new-password"
            label="Nytt lösenord"
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            autoComplete="new-password"
          />
          <InputField
            id="confirm-password"
            label="Bekräfta nytt lösenord"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
          />
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            endIcon={<SaveIcon />}
            sx={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Spara ändringar
          </Button>
        </div>
        <div className="settingsItem" style={{ alignItems: "flex-start" }}>
          <Typography variant="h5" sx={{ marginBottom: "16px" }}>
            Systeminställningar
          </Typography>
          <div className="systemSettingsOpt">
            <div>
              <Typography variant="h6">
                Synkronisera kunder automatiskt
              </Typography>
              <Typography variant="subtitle2">
                Hämta kunder från Tickster automatiskt
              </Typography>
            </div>
            <Switch />
          </div>
          <div className="systemSettingsOpt">
            <div>
              <Typography variant="h6">Schemalägg synkronisering</Typography>
              <Typography variant="subtitle2">
                Schemalägg när den automatiska synkroniseringen av kunder ska
                ske
              </Typography>
            </div>
            <MaintenanceClock />
          </div>
        </div>
      </Stack>
    </Paper>
  );
};

export default SettingsContainer;
