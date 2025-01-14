import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Customers from './pages/Customers';
import Mailing from './pages/Mailing';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import ProtectedRoute from './utils/ProtectedRoute';
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

/**
 * AppContent-komponenten hanterar visningen av navigationsfältet och innehållet baserat på den aktuella URL-sökvägen.
 *
 * @param {Object} props - Egenskaper som skickas till komponenten.
 * @param {boolean} props.openNav - Anger om navigationsfältet är öppet eller stängt.
 * @param {Function} props.setOpenNav - Funktion för att uppdatera tillståndet för navigationsfältet.
 *
 * @returns {JSX.Element} JSX-element som representerar applikationens innehåll.
 *
 * Komponentens beteende:
 * - Använder `useLocation` för att få den aktuella URL-sökvägen.
 * - Bestämmer om navigationsfältet ska visas baserat på om sökvägen är '/login' eller inte.
 * - Renderar `NavBar`-komponenten om `showNavBar` är sant.
 * - Renderar olika rutter baserat på URL-sökvägen med hjälp av `Routes` och `Route` komponenterna.
 * - Om sökvägen är '/', omdirigeras användaren till '/home'.
 * - Om sökvägen är '/login', renderas `AdminLogin`-komponenten.
 * - För skyddade rutter som '/home', '/customers', '/mailing' och '/settings', används `ProtectedRoute`-komponenten för att säkerställa att användaren är autentiserad innan de får tillgång.
 */
const AppContent = ({ openNav, setOpenNav }) => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/login';

  return (
    <div className="appContainer">
      {showNavBar && <NavBar openNav={openNav} setOpenNav={setOpenNav} />}
      <div className={`content ${showNavBar ? 'withNavBar' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/home" element={<ProtectedRoute element={Home} />} />
          <Route path="/customers" element={<ProtectedRoute element={Customers} />} />
          <Route path="/mailing" element={<ProtectedRoute element={Mailing} />} />
          <Route path="/settings" element={<ProtectedRoute element={Settings} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;