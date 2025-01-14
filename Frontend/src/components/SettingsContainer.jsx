import React, { useState } from "react";
import {
  Stack,
  Paper,
  Divider,
  Typography,
  SaveIcon,
  Dialog,
  DialogContent,
} from "../utils/MaterialUI";
import InputField from "./InputField";
import Button from "./Button";
import LoadingCircle from "./LoadingCircle";
import axios from "axios";

/**
 * @component SettingsContainer
 * @description SettingsContainer-komponenten hanterar användarens kontoinställningar.
 * Den tillåter användaren att ändra sitt användarnamn och lösenord.
 * 
 * @example
 * return (
 *   <SettingsContainer />
 * )
 * 
 * @returns {JSX.Element} En komponent som renderar ett formulär för att uppdatera kontoinställningar.
 * 
 * @description
 * Komponentens tillstånd hanterar följande:
 * - newUsername: Det nya användarnamnet som användaren vill ställa in.
 * - currentPassword: Det nuvarande lösenordet som användaren måste ange för att verifiera ändringar.
 * - newPassword: Det nya lösenordet som användaren vill ställa in.
 * - confirmPassword: Bekräftelse av det nya lösenordet.
 * - showCurrentPassword, showNewPassword, showConfirmPassword: Booleska värden för att visa eller dölja lösenord.
 * - loading: Indikerar om uppdateringsprocessen pågår.
 * - updateSuccess: Indikerar om uppdateringen lyckades.
 * - error: Felmeddelande om något går fel under uppdateringen.
 * 
 * @function handleUsernameChange - Hanterar ändringar i användarnamnsfältet.
 * @function handleCurrentPasswordChange - Hanterar ändringar i fältet för nuvarande lösenord.
 * @function handleNewPasswordChange - Hanterar ändringar i fältet för nytt lösenord.
 * @function handleConfirmPasswordChange - Hanterar ändringar i fältet för bekräftelse av nytt lösenord.
 * @function handleClickShowCurrentPassword - Växlar visningen av det nuvarande lösenordet.
 * @function handleClickShowNewPassword - Växlar visningen av det nya lösenordet.
 * @function handleClickShowConfirmPassword - Växlar visningen av bekräftelsen av det nya lösenordet.
 * @function handleMouseDownPassword - Förhindrar standardbeteendet vid musnedtryckning på lösenordsfältet.
 * @function handleSubmit - Hanterar formulärets submit-händelse och anropar handleSaveChanges.
 * @function handleSaveChanges - Utför API-anropet för att spara ändringarna och hanterar svaren.
 * @function handleCloseSuccessDialog - Stänger dialogen för framgångsrik uppdatering och laddar om sidan.
 */
const SettingsContainer = () => {
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSaveChanges();
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      setError("Nya lösenordet matchar inte det nuvarande lösenordet");
      return;
    }

    // Logga ändringarna som skickas
    // console.log("Spara ändringar:", {
    //   newUsername,
    //   currentPassword,
    //   newPassword,
    //   confirmPassword,
    // });

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/admin/change-details",
        {
          currentPassword: currentPassword,
          newName: newUsername,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      console.error("Error updating admin details:", error);
      setError("Nuvarande lösenord är felaktigt");
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
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <form onSubmit={handleSubmit} className="settingsForm">
          <div className="settingsItem" style={{ alignItems: "start" }}>
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
                required
              />
              {error && (
                <Typography color="error" sx={{ mb: 3 }}>
                  {error}
                </Typography>
              )}
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
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              sx={{
                marginTop: "16px",
                marginBottom: "16px",
                width: "355px", // Match width of other form elements
              }}
            >
              Spara kontoändringar
            </Button>
          </div>
        </form>
        {/* <div className="settingsItem" style={{ alignItems: "flex-start" }}>
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
        </div> */}
      </Stack>
      <Dialog open={loading}>
        <DialogContent className="standardDialog">
          <h2>Uppdaterar kontoinformation...</h2>
          <LoadingCircle />
        </DialogContent>
      </Dialog>
      <Dialog open={updateSuccess} onClose={handleCloseSuccessDialog}>
        <DialogContent className="standardDialog" sx={{ textAlign: "center" }}>
          <h2>Användarkontot har uppdaterats.</h2>
          <Button
            onClick={handleCloseSuccessDialog}
            color="primary"
            variant="contained"
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default SettingsContainer;
