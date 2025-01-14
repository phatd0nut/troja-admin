import axios from 'axios';

// Bygg upp API_URL från miljövariabler
const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
const CUSTOMERS_URL = `${import.meta.env.VITE_CUSTOMERS_ENDPOINT}`;
const CUSTOMER_URL = `${import.meta.env.VITE_CUSTOMER_ENDPOINT}`;
const GROUPED_BY_GOODS_URL = `${import.meta.env.VITE_GROUPED_BY_GOODS_ENDPOINT}`;
const RECENT_PURCHASES_ENDPOINT = `${import.meta.env.VITE_RECENT_PURCHASES_ENDPOINT}`;
const TRIGGER_FETCH_URL = import.meta.env.VITE_TRIGGER_FETCH_ENDPOINT;
const PURCHASE_COUNTS_URL = import.meta.env.VITE_PURCHASE_COUNTS_ENDPOINT;
const LAST_MONTH_PURCHASES_URL = import.meta.env.VITE_LAST_MONTH_PURCHASES_ENDPOINT;
// const LAST_YEAR_PURCHASES_URL = import.meta.env.VITE_LAST_YEAR_PURCHASES_ENDPOINT;
const PURCHASES_URL = import.meta.env.VITE_PURCHASES_ENDPOINT;
const PURCHASE_DETAILS_URL = import.meta.env.VITE_PURCHASE_DETAILS_ENDPOINT;
const token = localStorage.getItem('token');

// Funktion för att hämta alla kunder
/**
 * Hämtar alla kunder från API:et.
 * 
 * Gör en GET-förfrågan till API:et för att hämta alla kunder.
 * Om förfrågan lyckas returneras kunddata.
 * Om förfrågan misslyckas loggas ett felmeddelande och felet kastas vidare.
 * 
 * @async
 * @function fetchAllCustomers
 * @returns {Promise<Object>} Ett löfte som löser sig till kunddata.
 * @throws {Error} Om det uppstår ett fel vid hämtning av kunder.
 */
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
/**
 * Hämtar kunder grupperade efter varor från API:et.
 * 
 * @async
 * @function fetchCustomersGroupedByGoods
 * @returns {Promise<Object>} Ett objekt som innehåller två listor av kunder:
 * - `allCustomers`: Alla kunder som hämtats från API:et.
 * - `customersWithAcceptInfo`: Kunder som har accepterat information (acceptInfo === 1).
 * @throws {Error} Om ett fel uppstår vid hämtning av kunder.
 * 
 * @example
 * fetchCustomersGroupedByGoods()
 *   .then(data => {
 *     console.log(data.allCustomers); // Alla kunder
 *     console.log(data.customersWithAcceptInfo); // Kunder som har accepterat information
 *   })
 *   .catch(error => {
 *     console.error('Fel vid hämtning av kunder grupperade efter varor:', error);
 *   });
 */
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

/**
 * Hämtar kundens senaste köp.
 *
 * @param {string} customerRef - Referensen till kunden vars köp ska hämtas.
 * @returns {Promise<Object>} En promise som löser sig till kundens senaste köpdata.
 * @throws {Error} Om ett fel inträffar vid hämtning av kundens köp.
 *
 * @example
 * fetchCustomerPurchases('customer123')
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
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

/**
 * Triggar en hämtning av data från servern.
 * 
 * Skickar en POST-förfrågan till en specifik URL för att initiera hämtning av data.
 * 
 * @async
 * @function triggerFetchData
 * @throws {Error} Om det uppstår ett fel vid hämtningen.
 * 
 * @example
 * // Exempel på hur man använder funktionen
 * triggerFetchData()
 *   .then(() => {
 *     console.log('Data hämtad framgångsrikt');
 *   })
 *   .catch((error) => {
 *     console.error('Fel vid hämtning av data:', error);
 *   });
 */
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

/**
 * Hämtar antalet biljetter från servern.
 * 
 * Gör en GET-förfrågan till servern för att hämta antalet biljetter.
 * Använder axios för att göra förfrågan och inkluderar nödvändiga headers.
 * 
 * @async
 * @function fetchTicketCounts
 * @returns {Promise<Object>} Ett löfte som löser sig till data från serverns svar.
 * @throws {Error} Om det uppstår ett fel vid hämtning av biljettantal.
 */
export const fetchTicketCounts = async () => {
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

/**
 * Hämtar nya kunder från förra månaden.
 *
 * Denna funktion gör en asynkron GET-förfrågan till en API-endpoint för att hämta data om nya kunder som har gjort köp under den senaste månaden.
 * Om förfrågan lyckas returneras data från svaret.
 * Om förfrågan misslyckas loggas ett felmeddelande och felet kastas vidare.
 *
 * @async
 * @function fetchNewCustomersLastMonth
 * @returns {Promise<Object>} Ett löfte som löser sig till data om nya kunder från förra månaden.
 * @throws {Error} Om det uppstår ett fel vid hämtning av data.
 */
export const fetchNewCustomersLastMonth = async () => {
    try {
        const response = await axios.get(BASE_URL + CUSTOMERS_URL + LAST_MONTH_PURCHASES_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching new customers last month:', error);
        throw error;
    }
};

// export const fetchNewCustomersLastYear = async () => {
//     try {
//         const response = await axios.get(BASE_URL + CUSTOMERS_URL + LAST_YEAR_PURCHASES_URL, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         return response.data;
//     }
//     catch (error) {
//         console.error('Error fetching new customers last year:', error);
//         throw error;
//     }
// };

/**
 * Hämtar detaljer om köp från servern.
 * 
 * Gör en asynkron GET-förfrågan till servern för att hämta detaljer om köp.
 * Använder axios för att göra HTTP-förfrågan.
 * 
 * @returns {Promise<Object>} Ett löfte som löser sig till data från serverns svar.
 * @throws {Error} Om ett fel uppstår under hämtningen av köpuppgifter.
 * 
 * @example
 * fetchPurchaseDetails()
 *   .then(data => {
 *     console.log('Köpuppgifter:', data);
 *   })
 *   .catch(error => {
 *     console.error('Fel vid hämtning av köpuppgifter:', error);
 *   });
 */
export const fetchPurchaseDetails = async () => {
    try {
        const response = await axios.get(BASE_URL + PURCHASES_URL + PURCHASE_DETAILS_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching purchase details:', error);
        throw error;
    }
};