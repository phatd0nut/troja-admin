const pool = require('../config/db');
/**
 * Hämtar alla varor från databasen
 * @returns {Promise<Array<object>>} - alla varor
 */
const getAllGoods = async () => {
    const [rows] = await pool.query('SELECT * FROM Goods'); 
    return rows;
};

module.exports = { getAllGoods };