const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const cron = require("node-cron");
require('dotenv').config();

// Update the filePath to point to the data directory
const dataDir = path.resolve(__dirname, "../data"); // Adjusted path to go one level up
const filePath = path.join(dataDir, "tempData.json");

let lastFetchTime = null;
let isFetching = false;
let isWriting = false;

const tasks = {};
let deletionTime = "0 3 * * *"; // Default to 3 AM every day

const fetchWithRetry = async (url, params, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.TS_Username}:${process.env.TS_Password}`).toString('base64')}`,
                    'User-Agent': 'MyApp/1.0',
                    'Content-Type': 'application/json',
                },
            });
            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(`Attempt ${i + 1} failed:`, {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data,
                });
            } else if (error.request) {
                console.error(`Attempt ${i + 1} failed: No response received.`);
            } else {
                console.error(`Attempt ${i + 1} failed:`, error.message);
            }

            if (i < retries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
};

const fetchDataAndLog = async () => {
    if (isWriting) {
        console.log('Skipping fetch as file is being written.');
        return;
    }

    const url = process.env.TSapi;
    let allData = [];
    let currentBeginAt = 0;
    const limit = 5;

    let existingCrmIds = new Set();

    
    try {
        const existingData = await fs.readFile(filePath, 'utf-8');
        if (existingData) {
            const parsedData = JSON.parse(existingData);
            allData = parsedData; 
            parsedData.forEach(user => existingCrmIds.add(user.Crmid));
        }
    } catch (error) {
        console.error("Error reading existing data:", error.message);
    }

    try {
        
        await fs.mkdir(dataDir, { recursive: true });

        const response = await fetchWithRetry(url, {
            beginAt: currentBeginAt,
            limit: limit,
        });

        if (!response || !response.purchases || response.purchases.length === 0) {
            console.error('No purchases found in the response:', response);
            return;
        }

        const data = response.purchases;

        data.forEach(item => {
            const purchase = item.purchase;
            console.log('Processing purchase:', purchase);

            const user = {
                Crmid: purchase.crmId,
                userrefno: purchase.userRefNo,
                firstName: purchase.firstName,
                lastName: purchase.lastName,
                postalAddressLineOne: purchase.postalAddressLineOne,
                zipcode: purchase.zipcode,
                city: purchase.city,
                Company: purchase.company,
                events: purchase.events && purchase.events.length > 0 ? purchase.events.map(event => ({
                    name: event.name,
                    start: event.start,
                    end: event.end
                })) : [],
                goods: purchase.goods && purchase.goods.length > 0 ? purchase.goods.map(good => ({
                    name: good.name,
                    receipttext: good.receiptText,
                    type: good.type,
                    artno: good.artNo,
                    priceIncVatAfterDiscount: good.priceIncVatAfterDiscount
                })) : []
            };

            
            if (!existingCrmIds.has(user.Crmid)) {
                allData.push(user);
                existingCrmIds.add(user.Crmid); 
            } else {
                console.log(`Skipping duplicate CRM ID: ${user.Crmid}`);
            }
        });

        isWriting = true;
        await fs.writeFile(filePath, JSON.stringify(allData, null, 2) + '\n'); 
        console.log(`Data logged to tempData.json: ${allData.length} records written.`);
        
        lastFetchTime = new Date();
    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
        isWriting = false;
    }
};
const setDeletionTime = (time) => {
    deletionTime = time;

    if (tasks.deletionTask) {
        tasks.deletionTask.stop();
        delete tasks.deletionTask;
    }

    tasks.deletionTask = cron.schedule(deletionTime, async () => {
        if (isFetching) {
            console.log('Skipping deletion during fetch.');
            return;
        }
        try {
            await fs.unlink(filePath);
            console.log('Cached data deleted based on updated schedule.');
        } catch (error) {
            console.error('Error deleting cached data:', error);
        }
    });
};

const scheduleTasks = () => {
    const fetchInterval = process.env.FETCH_INTERVAL || '*/1 * * * *';

    cron.schedule(fetchInterval, async () => {
        if (isFetching) {
            console.log('Fetch in progress, skipping...');
            return;
        }
        isFetching = true;
        try {
            await fetchDataAndLog();
        } catch (error) {
            console.error('Error in scheduled fetch:', error.message);
        } finally {
            isFetching = false;
        }
    });

    setDeletionTime(deletionTime);
};

scheduleTasks();

module.exports = { fetchDataAndLog, setDeletionTime };