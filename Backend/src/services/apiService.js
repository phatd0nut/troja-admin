const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

const filePath = path.join(__dirname, 'tempData.json');
let lastFetchTime = null;
let deletionTime = '0 3 * * *'; // Default to 3 AM every day

const fetchDataAndLog = async () => {
  const url = process.env.TSapi; 
  let allData = [];
  let currentPage = 1;
  const limit = 500; 

  try {
    while (true) {
      const response = await axios.get(url, {
        params: {
          page: currentPage, 
          limit: limit, 
        },
      });

      const data = response.data;

      // If no data is returned, break the loop
      if (data.length === 0) {
        break;
      }

      
      allData = [...allData, ...data.filter(item => !allData.some(existingItem => existingItem.id === item.id))];

      // Increment the page number for the next request
      currentPage++;
    }

    // Write all fetched data to file
    await fs.writeFile(filePath, JSON.stringify(allData, null, 2));
    console.log('Data logged to tempData.json');

    // Update last fetch time
    lastFetchTime = new Date();

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Function to set deletion time from the frontend
const setDeletionTime = (time) => {
  deletionTime = time;
  scheduleDeletion();
};

// Function to schedule deletion based on the deletion time
const scheduleDeletion = () => {
  // Clear any existing scheduled tasks
  cron.getTasks().forEach(task => task.stop());

  // Schedule a new deletion task
  cron.schedule(deletionTime, async () => {
    try {
      await fs.unlink(filePath);
      console.log('Cached data deleted based on scheduled time');
    } catch (error) {
      console.error('Error deleting cached data:', error);
    }
  });
};

// Initial scheduling of deletion
scheduleDeletion();

module.exports = { fetchDataAndLog, setDeletionTime };