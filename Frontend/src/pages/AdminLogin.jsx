import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginContainer from "../components/LoginContainer";
import LoadingCircle from "../components/LoadingCircle"; // Importera LoadingCircle-komponenten
import { loginAdmin } from "../services/adminService"; // Importera inloggningsfunktionen
import { Dialog, DialogContent, Button } from "../utils/MaterialUI"; //
import "./adminLogin.css"; // Importera CSS-filen

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Tillstånd för att spåra laddningsstatus
  const navigate = useNavigate(); // Använd useNavigate för att omdirigera

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
    try {
      const data = await loginAdmin(username, password);
      // Spara token och annan data i localStorage eller state
      localStorage.setItem("token", data.token);
      console.log("Login successful:", data);
      // Fördröj navigeringen till /home med 2 sekunder
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/home");
    } catch (error) {
      setError("Login failed. Please check your username and password.");
    } finally {
      setLoading(false); // Sätt laddningsstatus till false
    }
  };
  return (
    <div className="adminLoginWrapper">
      {loading ? (
        <Dialog open={loading}>
          <DialogContent className="standardDialog">
            <h2>Loggar in...</h2>
            <LoadingCircle size={80} />
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
          />
          {error && <p className="error">{error}</p>}
          <Button type="submit">Logga in</Button>
        </form>
      )}
    </div>
  );
};

export default AdminLogin;
