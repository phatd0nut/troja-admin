const pool = require('../config/db');

/**
 * Hämtar alla kunder från databasen
 * @returns {Promise<Array<object>>} - alla kunder
 */
const getAllCustomers = async () => {
    const [rows] = await pool.query('SELECT * FROM Customer');
    return rows;
};

module.exports = { getAllCustomers };