const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const publicEventUrl = process.env.BASE_EVENT_URL;
const take = 100;
const skip = 0;
const eog = process.env.EOGREQUESTCODE
const key = process.env.TSApi;

const url = `${publicEventUrl}${eog}/events?take=${take}&skip=${skip}&eventHierarchyType=production-child`;

console.log('URL:', url);


const getPublicEvents = async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.TS_Username}:${process.env.TS_Password}`).toString('base64')}`,
                'User-Agent': 'MyApp/1.0',
                'Content-Type': 'application/json',
                'X-Api-Key': key, // Lägg till X-Api-Key i headern
            },
        });
    
        const filteredData = response.data.items.filter((event) => event.eventHierarchyType === 'production-child');
        return filteredData;
    } catch (error) {
        console.error('Error fetching public events:', error);
    }
};

module.exports = { getPublicEvents };