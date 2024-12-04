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
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`); 
});