/**
 * customerService.js är en fil som innehåller funktioner för att hantera kunder
 */

const pool = require('../config/db');

/**
 * Hämtar alla kunder från databasen
 * @returns {Promise<Array<object>>} - alla kunder
 */
const getAllCustomers = async () => {
    const [rows] = await pool.query('SELECT * FROM Customer');
    return rows;
};

/**
 * Hämtar kunder grupperade efter varor
 * @returns {Promise<Array<object>>} - kunder grupperade efter varor
 */
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

/**
 * Hämtar antalet kunder från senaste månaden
 * @returns {Promise<number>} - antalet kunder från senaste månaden
 */
const getCustomersLastMonth = async () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1); 

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth(), 0); 

    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM customer WHERE createdUtc >= ? AND createdUtc <= ?`,
        [lastMonth, currentDate] 
    );
    return rows[0].count; 
};
/**
 * Hämtar antalet kunder från senaste året
 * @returns {Promise<number>} - antalet kunder från senaste året
 */
const getCustomersLastYear = async () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    lastYear.setMonth(0); 
    lastYear.setDate(1); 

    const currentDate = new Date(); 
    
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM customer WHERE createdUtc >= ? AND createdUtc <= ?`,
        [lastYear, currentDate] 
    );
    return rows[0].count;
};
//exporterar getAllCustomers, getCustomersGroupedByGoods, getCustomersLastMonth, getCustomersLastYear för att kunna använda dem i andra filer
module.exports = { getAllCustomers, getCustomersGroupedByGoods, getCustomersLastMonth, getCustomersLastYear };