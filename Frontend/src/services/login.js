import axios from 'axios';

/**
 * Loggar in en användare med angivet användarnamn och lösenord.
 *
 * @param {string} username - Användarens användarnamn.
 * @param {string} password - Användarens lösenord.
 * @returns {Promise<void>} En promise som löser sig när inloggningen är klar.
 *
 * @throws {Error} Om inloggningen misslyckas.
 *
 * Gör en POST-begäran till API:et för att logga in användaren. Om inloggningen
 * lyckas, lagras JWT-token i lokal lagring och ett meddelande skrivs ut i konsolen.
 * Om inloggningen misslyckas, skrivs ett felmeddelande ut i konsolen.
 */
const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', { username, password });
    const { token } = response.data;

    // Lagra token i lokal lagring
    localStorage.setItem('jwtToken', token);

    console.log('Login successful, token stored.');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

export default login;