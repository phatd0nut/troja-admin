import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * En komponent som skyddar en rutt och omdirigerar till inloggningssidan om användaren inte är autentiserad.
 *
 * @param {Object} props - Egenskaper som skickas till komponenten.
 * @param {React.Component} props.element - Den komponent som ska renderas om användaren är autentiserad.
 * @param {...Object} rest - Övriga egenskaper som skickas till komponenten.
 * @returns {React.Element} - Returnerar den skyddade komponenten om användaren är autentiserad, annars omdirigeras till inloggningssidan.
 */
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');

  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;