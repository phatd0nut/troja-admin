import React, { useState } from "react";
import {
  Stack,
  Paper,
  Divider,
  Typography,
  SaveIcon,
  Switch,
  Dialog,
  DialogContent,
  DialogActions,
} from "../utils/MaterialUI";
import InputField from "./InputField";
import Button from "./Button";
import MaintenanceClock from "./MaintenanceClock";
import LoadingCircle from "./LoadingCircle"; // Importera LoadingCircle
import axios from 'axios';

const SettingsContainer = () => {
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Lägg till loading state
  const [updateSuccess, setUpdateSuccess] = useState(false); // Lägg till updateSuccess state
  const [error, setError] = useState(""); // Lägg till error state

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

  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    // Logga ändringarna som skickas
    console.log("Spara ändringar:", {
      newUsername,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/admin/change-details', {
        currentPassword: currentPassword,
        newName: newUsername,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Uppdatera användarnamnet i localStorage
      if (newUsername) {
        localStorage.setItem("username", newUsername);
      }

      // Visa laddningsmodal och uppdatera sidan efter 2 sekunder
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setUpdateSuccess(true);
      }, 2000);
    } catch (error) {
      console.error('Error updating admin details:', error);
      setError('Nuvarande lösenord är felaktigt');
    }
  };

  const handleCloseSuccessDialog = () => {
    setUpdateSuccess(false);
    window.location.reload();
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
          <Stack direction="column-reverse">
            <InputField
              id="current-password"
              label="Nuvarande lösenord"
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              autoComplete="current-password"
              showPasswordToggle
              showPassword={showCurrentPassword}
              handleClickShowPassword={handleClickShowCurrentPassword}
              handleMouseDownPassword={handleMouseDownPassword}
            />
            {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}
          </Stack>
          <InputField
            id="new-password"
            label="Nytt lösenord"
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            autoComplete="new-password"
            showPasswordToggle
            showPassword={showNewPassword}
            handleClickShowPassword={handleClickShowNewPassword}
            handleMouseDownPassword={handleMouseDownPassword}
          />
          <InputField
            id="confirm-password"
            label="Bekräfta nytt lösenord"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            showPasswordToggle
            showPassword={showConfirmPassword}
            handleClickShowPassword={handleClickShowConfirmPassword}
            handleMouseDownPassword={handleMouseDownPassword}
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
      <Dialog open={loading}>
        <DialogContent className="standardDialog">
          <h2>Uppdaterar kontoinformation...</h2>
          <LoadingCircle />
        </DialogContent>
      </Dialog>
      <Dialog open={updateSuccess} onClose={handleCloseSuccessDialog}>
        <DialogContent className="standardDialog" sx={{ textAlign: 'center' }}>
          <h2>Användarkontot har uppdaterats.</h2>
          <Button onClick={handleCloseSuccessDialog} color="primary" variant="contained">
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default SettingsContainer;