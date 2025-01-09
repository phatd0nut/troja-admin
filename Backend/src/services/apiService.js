// Backend/src/services/apiService.js
/**
 * ApiService.js är en fil som innehåller funktioner för att hämta data från API:et och logga det
 * @module ApiService
 */

const axios = require("axios"); //importerar axios för att kunna göra HTTP-förfrågningar
const fs = require("fs").promises; //importerar fs för att kunna läsa och skriva filer
const path = require("path"); //importerar path för att kunna arbeta med filsystemets vägar
const cron = require("node-cron"); //importerar cron för att kunna köra en cron-jobb
require('dotenv').config(); //importerar dotenv för att kunna läsa miljövariabler från en .env-fil
const { insertDataFromJson } = require('./dataInsertationService'); //importerar insertDataFromJson för att kunna infoga data från en json-fil
const { calculateAndUpdatePointsFromDatabase } = require('./pointsService'); //importerar calculateAndUpdatePointsFromDatabase för att kunna beräkna och uppdatera poängen från databasen

const dataDir = path.resolve(__dirname, "../data"); //skapar en variabel för att kunna använda filsystemets vägar
const filePath = path.join(dataDir, "tempData.json");
const baseUrl = process.env.BASE_URL; //skapar en variabel för att kunna använda miljövariabeln BASE_URL
const TSapi = process.env.TSapi; //skapar en variabel för att kunna använda miljövariabeln TSapi
const eogRequestCode = process.env.EOGREQUESTCODE; //skapar en variabel för att kunna använda miljövariabeln EOGREQUESTCODE
const beginAt = 0; //skapar en variabel för att kunna använda miljövariabeln beginAt
const limit = 500; //skapar en variabel för att kunna använda miljövariabeln limit

let lastFetchTime = null; //skapar en variabel för att kunna använda miljövariabeln lastFetchTime
let isFetching = false; //skapar en variabel för att kunna använda miljövariabeln isFetching
let isWriting = false; //skapar en variabel för att kunna använda miljövariabeln isWriting

const tasks = {};
//let deletionTime = "0 3 * * *"; // Default to 3 AM every day

/**
 * Hämtar data från API:et med försök att hantera fel
 * @param {string} url - URL:en för API:et
 * @param {object} params - parametrarna för förfrågan
 * @param {number} retries - antalet försök att hämta data
 * @param {number} delay - fördröjningen mellan försöken i millisekunder
 * @returns {Promise<object>} - dataen från API:et
 */
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
      return response.data;
    } catch (error) {
      handleFetchError(error, i);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
};

/**
 * Hanterar fel vid hämtning av data
 * @param {object} error - felobjektet
 * @param {number} attempt - aktuellt försök
 */
const handleFetchError = (error, attempt) => {
  if (error.response) {
    console.error(`Attempt ${attempt + 1} failed:`, {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
    });
  } else if (error.request) {
    console.error(`Attempt ${attempt + 1} failed: No response received.`);
  } else {
    console.error(`Attempt ${attempt + 1} failed:`, error.message);
  }
};

/**
 * Konverterar ett ISO 8601-datum till MySQL-datum
 * @param {string} isoDate - ISO 8601-datum
 * @returns {string} - MySQL-datum
 * @example
 */
function convertToMySQLDateTime(isoDate) {
  return isoDate.slice(0, 19).replace('T', ' ');
};

/**
 * Beräknar datumet ett år tillbaka från idag
 * @returns {Date} - Datumet ett år tillbaka
 */
const getOneYearBackDate = () => {
  const currentDate = new Date();
  return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
};

/**
 * Hämtar data från API:et och loggar det
 */
const fetchDataAndLog = async () => {
  if (isWriting) {
    console.log('Skipping fetch as file is being written.');
    return;
  }

  let allData = [];
  let existingCrmIds = new Set();
  let currentBeginAt = beginAt;

  try {
    await fs.mkdir(dataDir, { recursive: true });
    let hasMoreData = true;

    while (hasMoreData) {
      const url = `${baseUrl}${eogRequestCode}/${currentBeginAt}/${limit}?key=${TSapi}`;
      console.log(`Current fetched url: ${url}`);
      const response = await fetchWithRetry(url);

      if (!response) {
        console.error('No purchases found in the response:', response);
        break;
      }

      const data = response.purchases;
      console.log(`Fetched ${data.length} records starting from ${currentBeginAt}`);

      data.forEach(item => {
        const purchase = item.purchase;
        const createdDate = new Date(purchase.createdUtc);

        // byt till getOneYearBackDate() istället för new Date('2024-01-01T00:01:01.01Z') om man vill hämta data från ett år tillbaka dynamiskt
        const isValidPurchase = createdDate >= new Date('2024-01-01T00:01:01.01Z') &&
          (purchase.status === "Completed" || purchase.status === "Refunded");
      
        if (isValidPurchase) {
          const currentDate = new Date();
          const user = {
            Crmid: purchase.crmId,
            status: purchase.status,
            userrefno: purchase.userrefno,
            firstname: purchase.firstname,
            lastname: purchase.lastname,
            email: purchase.email,
            mobilePhoneNo: purchase.mobilePhoneNo,
            acceptInfo: purchase.acceptInfo,
            createdUtc: convertToMySQLDateTime(purchase.createdUtc),
            postalAddressLineOne: purchase.postalAddressLineOne,
            zipcode: purchase.zipcode,
            city: purchase.city,
            isCompany: purchase.isCompany,
            companyName: purchase.companyName,
            addition_date: currentDate,
            campaigns: purchase.campaigns?.map(campaign => ({
              id: campaign.id,
              communicationId: campaign.communicationId,
              activationCode: campaign.activationCode,
              internalReference: campaign.internalReference
            })) || [],
            events: purchase.events?.map(event => ({
              id: event.id,
              name: event.name,
              start: event.start,
              end: event.end,
              address: (event.venue.address && event.venue.zipcode && event.venue.city && event.venue.country) ?
                `${event.venue.address} ${event.venue.zipcode} ${event.venue.city} ${event.venue.country}` : null,
            })) || [],
            goods: purchase.goods?.map(good => ({
              goodsid: good.goodsid,
              name: good.name,
              receipttext: good.receiptText,
              type: good.type,
              artno: good.artno,
              priceIncVatAfterDiscount: good.priceIncVatAfterDiscount,
              eventId: good.eventId
            })) || []
          };

          if (!existingCrmIds.has(user.Crmid)) {
            allData.push(user);
            existingCrmIds.add(user.Crmid);
          }
        }
      });

      const maxCrmId = data[data.length - 1].purchase.crmId;

      isWriting = true;
      await fs.writeFile(filePath, JSON.stringify(allData, null, 2) + '\n');
      console.log(`Data logged to tempData.json: ${allData.length} records written.`);

      if (data.length < limit) {
        console.log('Less than 500 records fetched, stopping fetch.');
        hasMoreData = false;
        try {
          await insertDataFromJson();
          await calculateAndUpdatePointsFromDatabase();
          console.log('Data insertion triggered successfully.');
          //tar bort tempData.json efter att data har infogats och poängen har beräknats
          //-------------------------------------------------------------------------------------
          await fs.unlink(filePath);
          console.log('Cached data deleted after insertion and point calculation.');
          //-------------------------------------------------------------------------------------
        } catch (error) {
          console.error('Error during data insertion:', error.message);
        }
        break;
      }
      currentBeginAt = maxCrmId;
      console.log(`Updating currentBeginAt to ${currentBeginAt}`);
    }

    lastFetchTime = new Date();
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
  } finally {
    isWriting = false;
  }
};

/**
 * Sätter tiden för att ta bort datan
 * @param {string} time - tiden för att ta bort datan
 */
/* const setDeletionTime = (time) => {
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
}; */

/**
 * Schemalägger uppgifter
 */
const scheduleTasks = () => {
  const fetchInterval = process.env.FETCH_INTERVAL || '0 0 * * *';

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

  //setDeletionTime(deletionTime);
};

scheduleTasks();

module.exports = { fetchDataAndLog };