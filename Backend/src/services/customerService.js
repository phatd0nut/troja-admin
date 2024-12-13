const pool = require('../config/db');

const getAllCustomers = async () => {
    const [rows] = await pool.query('SELECT * FROM Customer');
    return rows;
};

module.exports = { getAllCustomers };