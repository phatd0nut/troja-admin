/**
 * file: app.js
 * description: main file for the backend application
 * author: @LNU4 @phatd0nut @Github
 */

const express = require("express");
const cors = require("cors");
const logger = require('./logger');
const adminRoutes = require('./routes/adminRoutes');
const {fetchDataAndLog} = require('./services/apiService');
const { insertDataFromJson } = require('./services/dataInsertationService');
const cron = require('node-cron');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/admin', adminRoutes);
/* 
cron.schedule('* * * * *', async () => {
    await fetchDataAndLog();
    logger.info('Data fetch triggered immediately on server start.');
    
    this.stop();
});
 */
/**
 * Test route, used to insert data - should be deleted later on N.A 
 * 
 */
app.get('/test-insert', async (req, res) => {
    try {
        await insertDataFromJson(); 
        res.send('Data insertion triggered successfully.');
    } catch (error) {
        res.status(500).send('Error during data insertion: ' + error.message);
    }
});


app.listen(port, () => {
    logger.info(`Server is running on port ${port}`); 
});