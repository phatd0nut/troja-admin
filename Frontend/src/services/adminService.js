import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const LOGIN_URL = import.meta.env.VITE_LOGIN_ENDPOINT;

/**
 * Loggar in en användare med angivet användarnamn och lösenord.
 *
 * @param {string} username - Användarens användarnamn.
 * @param {string} password - Användarens lösenord.
 * @returns {Promise<Object>} En promise som löser sig till ett objekt med token och användarnamn.
 *
 * @throws {Error} Om inloggningen misslyckas.
 *
 * Gör en POST-begäran till API:et för att logga in användaren. Om inloggningen
 * lyckas, lagras JWT-token i lokal lagring.
 * Om inloggningen misslyckas, skrivs ett felmeddelande ut i konsolen.
 */
const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post(BASE_URL + LOGIN_URL, { username, password });
    const { token, username: returnedUsername } = response.data;

    // Returnera token och användarnamn
    return { token, username: returnedUsername };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default loginAdmin;