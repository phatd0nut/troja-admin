const pool = require('../config/db');
/**
 * Hämtar alla evenemang från databasen
 * @returns {Promise<Array<object>>} - alla evenemang
 */
const getAllEvents = async () => {
    const [rows] = await pool.query('SELECT * FROM Event'); 
    return rows;
};

module.exports = { getAllEvents };