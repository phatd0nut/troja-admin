import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginAdmin from "../services/adminService";
import LoginContainer from "../components/LoginContainer";
import LoadingCircle from "../components/LoadingCircle";
import { Dialog, DialogContent } from "../utils/MaterialUI";
import "./adminLogin.css";

/**
 * Komponent för administratörsinloggning.
 * 
 * @component AdminLogin
 * @returns {JSX.Element} JSX-element som representerar inloggningssidan för administratörer.
 * 
 * @description
 * Denna komponent hanterar inloggning för administratörer. Den kontrollerar om en token finns i localStorage
 * och omdirigerar användaren till hemsidan om en token hittas. Om ingen token hittas, visas inloggningsformuläret.
 * 
 * @example
 * <AdminLogin />
 * 
 * @function
 * @name AdminLogin
 * 
 * @property {string} username - Användarnamn som användaren anger.
 * @property {function} setUsername - Funktion för att uppdatera användarnamnet.
 * @property {string} password - Lösenord som användaren anger.
 * @property {function} setPassword - Funktion för att uppdatera lösenordet.
 * @property {boolean} showPassword - Tillstånd för att visa eller dölja lösenordet.
 * @property {function} setShowPassword - Funktion för att uppdatera tillståndet för att visa eller dölja lösenordet.
 * @property {boolean} loading - Tillstånd för att spåra laddningsstatus.
 * @property {function} setLoading - Funktion för att uppdatera laddningsstatus.
 * @property {string} error - Felmeddelande som visas vid inloggningsfel.
 * @property {function} setError - Funktion för att uppdatera felmeddelandet.
 * @property {boolean} checkingToken - Tillstånd för att spåra tokenkontroll.
 * @property {function} setCheckingToken - Funktion för att uppdatera tillståndet för tokenkontroll.
 * @property {function} navigate - Funktion för att omdirigera användaren.
 * 
 * @function useEffect - Hook som kontrollerar om en token finns i localStorage och omdirigerar användaren om en token hittas.
 * 
 * @function handleUsernameChange - Funktion som hanterar ändringar i användarnamnsfältet.
 * @param {object} event - Event-objektet som triggas vid ändring av användarnamnsfältet.
 * 
 * @function handlePasswordChange - Funktion som hanterar ändringar i lösenordsfältet.
 * @param {object} event - Event-objektet som triggas vid ändring av lösenordsfältet.
 * 
 * @function handleClickShowPassword - Funktion som hanterar visning och döljning av lösenordet.
 * 
 * @function handleMouseDownPassword - Funktion som förhindrar standardbeteendet vid musnedtryckning på lösenordsfältet.
 * @param {object} event - Event-objektet som triggas vid musnedtryckning.
 * 
 * @function handleSubmit - Funktion som hanterar inlämning av inloggningsformuläret.
 * @param {object} event - Event-objektet som triggas vid inlämning av formuläret.
 * 
 * @returns {JSX.Element|null} Returnerar JSX-element som representerar inloggningssidan eller null medan token kontrolleras.
 */
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Tillstånd för att spåra laddningsstatus
  const [error, setError] = useState('');
  const [checkingToken, setCheckingToken] = useState(true); // Tillstånd för att spåra tokenkontroll
  const navigate = useNavigate(); // Använd useNavigate för att omdirigera

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    } else {
      setCheckingToken(false); 
    }
  }, [navigate]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Sätt laddningsstatus till true
    setError(''); // Återställ felmeddelandet
    try {
      const data = await loginAdmin(username, password);
      // Spara token och användarnamn i localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      // Fördröj navigeringen till /home med 2 sekunder
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.message === 'Unauthorized') {
        setError("Fel användarnamn eller lösenord.");
      } else {
        setError("Ett fel uppstod. Försök igen senare.");
      }
    } finally {
      setLoading(false); // Sätt laddningsstatus till false
    }
  };
  
  if (checkingToken) {
    return null; // Rendera ingenting medan vi kontrollerar token
  }

  return (
    <div className="adminLoginWrapper">
      {loading ? (
        <Dialog open={loading}>
          <DialogContent className="standardDialog">
            <h2>Loggar in...</h2>
            <LoadingCircle />
          </DialogContent>
        </Dialog>
      ) : (
        <form onSubmit={handleSubmit}>
          <LoginContainer
            username={username}
            handleUsernameChange={handleUsernameChange}
            password={password}
            handlePasswordChange={handlePasswordChange}
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword}
            error={error}
          />
        </form>
      )}
    </div>
  );
};

export default AdminLogin;