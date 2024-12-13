const pool = require('../config/db');

const getAllGoods = async () => {
    const [rows] = await pool.query('SELECT * FROM Goods'); 
    return rows;
};

module.exports = { getAllGoods };