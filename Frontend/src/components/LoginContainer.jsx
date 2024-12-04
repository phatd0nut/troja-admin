import React from 'react';
import InputFields from './InputFields';
import './LoginContainer.css'; // Importera CSS-filen
import Button from './Button';

const LoginContainer = ({
  username,
  handleUsernameChange,
  password,
  handlePasswordChange,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
}) => {
  // Kontrollera om både användarnamn och lösenord är ifyllda
  const isFormValid = username.trim() !== '' && password.trim() !== '';

  return (
    <div className="loginWrapper">
      <div className="loginContainer">
        <InputFields
          label="Användarnamn"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          autoComplete="username"
        />
        <InputFields
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
          disabled={!isFormValid} // Inaktivera knappen om formuläret inte är giltigt
        >
          Logga in
        </Button>
      </div>
    </div>
  );
};

export default LoginContainer;