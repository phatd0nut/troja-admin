import axios from 'axios';

// Bygg upp API_URL från miljövariabler
const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
const CUSTOMER_URL = `${import.meta.env.VITE_CUSTOMER_ENDPOINT}`;
const GROUPED_BY_GOODS_URL = `${import.meta.env.VITE_GROUPED_BY_GOODS_ENDPOINT}`;

// Funktion för att hämta alla kunder
export const fetchAllCustomers = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(BASE_URL + CUSTOMER_URL, {
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

// Funktion för att hämta kunder grupperade efter köpta varor
export const fetchCustomersGroupedByGoods = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(BASE_URL + CUSTOMER_URL + GROUPED_BY_GOODS_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const allCustomers = response.data.customers || [];
        const customersWithAcceptInfo = allCustomers.filter(customer => customer.acceptInfo === 1);
        
        return {
            allCustomers,
            customersWithAcceptInfo,
        };
    } catch (error) {
        console.error('Error fetching customers grouped by goods:', error);
        throw error;
    }
};