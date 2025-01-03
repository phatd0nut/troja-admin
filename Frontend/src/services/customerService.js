import axios from 'axios';

// Bygg upp API_URL från miljövariabler
const API_URL = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CUSTOMER_ENDPOINT}`;

// Funktion för att hämta alla kunder
export const fetchAllCustomers = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};