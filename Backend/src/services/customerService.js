const pool = require('../config/db');

/**
 * Hämtar alla kunder från databasen
 * @returns {Promise<Array<object>>} - alla kunder
 */
const getAllCustomers = async () => {
    const [rows] = await pool.query('SELECT * FROM Customer');
    return rows;
};

const getCustomersGroupedByGoods = async () => {
    const query = `
        SELECT g.name AS goodsName, c.*
        FROM customer c
        JOIN purchase p ON c.userRefNo = p.userRefNo
        JOIN purchasegoods pg ON p.id = pg.purchaseId
        JOIN goods g ON pg.goodsId = g.id
        GROUP BY g.name, c.userRefNo
    `;
    const [rows] = await pool.query(query);
    return rows;
};

module.exports = { getAllCustomers, getCustomersGroupedByGoods };