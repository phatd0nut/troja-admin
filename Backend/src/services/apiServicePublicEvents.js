const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const publicEventUrl = process.env.BASE_EVENT_URL;
const take = 100;
const skip = 0;
const eog = process.env.EOGREQUESTCODE;
const key = process.env.TSApi;

const url = `${publicEventUrl}${eog}/events?take=${take}&skip=${skip}&eventHierarchyType=production-child`;

const cacheDir = path.resolve(__dirname, '../../caches'); // Uppdatera sökvägen till rotkatalogen
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}
const cacheFilePath = path.resolve(cacheDir, 'publicEventsCache.json');

const getPublicEvents = async () => {
    const now = new Date();

    // Kontrollera om cache-filen finns och är giltig (1 dag)
    if (fs.existsSync(cacheFilePath)) {
        console.log('Cache check');
        
        const cacheContent = fs.readFileSync(cacheFilePath, 'utf-8');
        const { data, timestamp } = JSON.parse(cacheContent);

        if ((now - new Date(timestamp)) < 24 * 60 * 60 * 1000) {
            console.log('Cache file is newer than 24 hours, using cache');
            return data;
        }
    }

    // Annars hämta data från API:et om det inte finns en sparad cache-fil eller om den är för gammal
    try {
        console.log('No cache file or cache file is older than 24 hours, fetching data from API');
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.TS_Username}:${process.env.TS_Password}`).toString('base64')}`,
                'User-Agent': 'MyApp/1.0',
                'Content-Type': 'application/json',
                'X-Api-Key': key,
            },
        });

        const today = new Date();
        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setMonth(today.getMonth() + 2); // Hämta event som sker inom 2 månader

        const filteredData = response.data.items.filter((event) => {
            const eventDate = new Date(event.startUtc);
            return event.eventHierarchyType === 'production-child' &&
                eventDate >= today && eventDate <= twoMonthsFromNow;
        });

        // Uppdatera cache-filen
        const cacheContent = {
            data: filteredData,
            timestamp: now
        };
        fs.writeFileSync(cacheFilePath, JSON.stringify(cacheContent));
        console.log('Cache updated');
        

        return filteredData;
    } catch (error) {
        console.error('Error fetching public events:', error);
    }
};

module.exports = { getPublicEvents };