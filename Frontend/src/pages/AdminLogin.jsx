import React, { useState } from 'react';
import LoginContainer from '../components/LoginContainer';
import './AdminLogin.css'; // Importera CSS-filen

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Hantera formulärinlämning här, t.ex. skicka data till en server
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <div className="adminLoginWrapper">
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
      </form>
    </div>
  );
};

export default AdminLogin;