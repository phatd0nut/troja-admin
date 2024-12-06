import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import NavBar from './components/NavBar'; // Importera NavBar-komponenten
import { ThemeProvider, theme } from './utils/MaterialUI';
import './App.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/login';

  return (
    <div className="appContainer">
      {showNavBar && <NavBar />}
      <div className={`content ${showNavBar ? 'withNavBar' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;