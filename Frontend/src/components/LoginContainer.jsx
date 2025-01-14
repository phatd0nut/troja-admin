import React from "react";
import InputField from "./InputField";
import "./LoginContainer.css";
import Button from "./Button";
import { Typography } from "../utils/MaterialUI";

/**
 * @component LoginContainer
 * @description LoginContainer-komponenten hanterar inloggningsformuläret.
 *
 * @param {Object} props - Egenskaper som skickas till komponenten.
 * @param {string} props.username - Användarnamnet som användaren anger.
 * @param {function} props.handleUsernameChange - Funktion för att hantera ändringar i användarnamnsfältet.
 * @param {string} props.password - Lösenordet som användaren anger.
 * @param {function} props.handlePasswordChange - Funktion för att hantera ändringar i lösenordsfältet.
 * @param {boolean} props.showPassword - Anger om lösenordet ska visas i klartext.
 * @param {function} props.handleClickShowPassword - Funktion för att hantera klick på visa lösenord-knappen.
 * @param {function} props.handleMouseDownPassword - Funktion för att hantera musens nedtryckning på visa lösenord-knappen.
 * @param {string} [props.error] - Felmeddelande som visas om inloggningen misslyckas.
 * @returns {JSX.Element} JSX-element som representerar inloggningsformuläret.
 */
const LoginContainer = ({
  username,
  handleUsernameChange,
  password,
  handlePasswordChange,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  error,
}) => {
  // Kontrollera om både användarnamn och lösenord är ifyllda
  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <div className="loginWrapper">
      <div className="loginContainer">
        {error && <Typography color="error">{error}</Typography>}
        <InputField
          label="Användarnamn"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          autoComplete="username"
        />
        <InputField
          label="Lösenord"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          autoComplete="current-password"
          showPasswordToggle={true}
          showPassword={showPassword}
          handleClickShowPassword={handleClickShowPassword}
          handleMouseDownPassword={handleMouseDownPassword}
        />
        <Button
          id="loginBtn"
          variant="contained"
          color="primary"
          type="submit"
          disabled={!isFormValid}
        >
          Logga in
        </Button>
      </div>
    </div>
  );
};

export default LoginContainer;
