/**
 * eventService.js är en fil som innehåller funktioner för att hantera evenemang
 */
const pool = require('../config/db');
/**
 * Hämtar alla evenemang från databasen
 * @returns {Promise<Array<object>>} - alla evenemang
 */
const getAllEvents = async () => {
    const [rows] = await pool.query('SELECT * FROM Event'); 
    return rows;
};
//exporterar getAllEvents för att kunna använda den i andra filer
module.exports = { getAllEvents };