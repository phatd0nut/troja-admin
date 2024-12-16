const pool = require('../config/db');
/**
 * Hämtar alla köp från databasen
 * @returns {Promise<Array<object>>} - alla köp
 */
const getAllPurchases = async () => {
    const [rows] = await pool.query('SELECT * FROM Purchase');
    return rows;
};

module.exports = { getAllPurchases };