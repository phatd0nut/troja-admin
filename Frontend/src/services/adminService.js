import axios from 'axios';

export const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3000/admin/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};