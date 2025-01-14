/**
 * file: app.js
 * description: main file for the backend application
 * author: @LNU4 @phatd0nut @Github
 */

const express = require("express"); //importerar express 
const cors = require("cors"); //importerar cors för att kunna skapa en cors-policy
const logger = require('./logger'); //importerar logger för att kunna logga meddelanden
const adminRoutes = require('./routes/adminRoutes'); //importerar adminRoutes för att kunna skapa en router för admin-relaterade routes
const {fetchDataAndLog} = require('./services/apiService'); //importerar fetchDataAndLog för att kunna hämta data från API:et och logga det
const { insertDataFromJson } = require('./services/dataInsertationService'); //importerar insertDataFromJson för att kunna infoga data från en json-fil
const cron = require('node-cron'); //importerar cron för att kunna köra en cron-jobb
const { removeOldUsers } = require('./services/cleanupService');

const app = express(); //skapar en express-app
const port = 3000; //skapar en port för att kunna starta servern

app.use(express.json()); //använder express.json() för att kunna parsa JSON-data
app.use(cors()); //använder cors() för att kunna skapa en cors-policy

app.use('/admin', adminRoutes); //använder adminRoutes för att kunna skapa en router för admin-relaterade routes

//Kör en cron-jobb som tar bort kunder som inte har handlat på 2 år. checkar varje dag kl 2:00
cron.schedule('0 2 * * *', async () => {
    console.log('Running cleanup task to remove old users...');
    await removeOldUsers();
});

//startar servern på port 3000
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`); 
});