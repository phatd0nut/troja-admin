import axios from 'axios';

// Bygg upp API_URL från miljövariabler
const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
const CUSTOMERS_URL = `${import.meta.env.VITE_CUSTOMERS_ENDPOINT}`;
const CUSTOMER_URL = `${import.meta.env.VITE_CUSTOMER_ENDPOINT}`;
const GROUPED_BY_GOODS_URL = `${import.meta.env.VITE_GROUPED_BY_GOODS_ENDPOINT}`;
const RECENT_PURCHASES_ENDPOINT = `${import.meta.env.VITE_RECENT_PURCHASES_ENDPOINT}`;
const TRIGGER_FETCH_URL = import.meta.env.VITE_TRIGGER_FETCH_ENDPOINT;
const PURCHASE_COUNTS_URL = import.meta.env.VITE_PURCHASE_COUNTS_ENDPOINT;

const token = localStorage.getItem('token');

// Funktion för att hämta alla kunder
export const fetchAllCustomers = async () => {
    try {
        const response = await axios.get(BASE_URL + CUSTOMERS_URL, {
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
    try {
        const response = await axios.get(BASE_URL + CUSTOMERS_URL + GROUPED_BY_GOODS_URL, {
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

export const fetchCustomerPurchases = async (customerRef) => {
    try {
        const response = await axios.get(`${BASE_URL}${CUSTOMER_URL}/${customerRef}${RECENT_PURCHASES_ENDPOINT}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching customer purchases:', error);
        throw error;
    }
};

export const triggerFetchData = async () => {
    try {
        await axios.post(
            `${BASE_URL}${TRIGGER_FETCH_URL}`,
            {}, // empty request body
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
    }
    catch (error) {
        console.error('Error triggering fetch:', error);
        throw error;
    }
};

export const fetchPurchaseCounts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}${PURCHASE_COUNTS_URL}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching purchase counts:', error);
        throw error;
    }
};
