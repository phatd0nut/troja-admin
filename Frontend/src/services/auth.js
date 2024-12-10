import axios from 'axios';

export const getAccessToken = async (clientId, clientSecret) => {
  try {
    const response = await axios.post('https://auth.getbee.io/apiauth', {
      client_id: clientId,
      client_secret: clientSecret,
    });
    // console.log('Access token:', response.data.access_token);
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};