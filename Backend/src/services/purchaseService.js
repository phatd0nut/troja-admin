const pool = require('../config/db');

const getAllPurchases = async () => {
    const [rows] = await pool.query('SELECT * FROM Purchase');
    return rows;
};

module.exports = { getAllPurchases };