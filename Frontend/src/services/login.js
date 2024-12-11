import axios from 'axios';

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