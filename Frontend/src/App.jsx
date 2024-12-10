import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Customers from './pages/Customers';
import NavBar from './components/NavBar'; // Importera NavBar-komponenten
import { ThemeProvider, theme } from './utils/MaterialUI';
import './App.css';

const App = () => {
  const [openNav, setOpenNav] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent openNav={openNav} setOpenNav={setOpenNav} />
      </Router>
    </ThemeProvider>
  );
};

const AppContent = ({ openNav, setOpenNav }) => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/login';

  return (
    <div className="appContainer">
      {showNavBar && <NavBar openNav={openNav} setOpenNav={setOpenNav} />}
      <div className={`content ${showNavBar ? 'withNavBar' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;