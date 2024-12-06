import axios from 'axios';

const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3000/admin/login', { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export { loginAdmin };