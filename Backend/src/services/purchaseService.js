/**
 * purchaseService.js är en fil som innehåller funktioner för att hantera köp i och från databasen
 */
const pool = require('../config/db');
/**
 * Hämtar alla köp från databasen
 * @returns {Promise<Array<object>>} - alla köp
 */
const getAllPurchases = async () => {
    const [rows] = await pool.query('SELECT * FROM Purchase');
    return rows;
};

/**
 * Hämtar de senaste 10 köpen för en given kund
 * @param {string} customerId - kundens ID
 * @returns {Promise<Array<object>>} - de senaste 10 köpen för kunden
 */
const getRecentPurchasesByCustomerId = async (customerId) => {
    const query = `
    SELECT p.*, g.name AS goodsName, g.priceIncVatAfterDiscount AS priceAfterVat
    FROM Purchase p
    JOIN purchasegoods pg ON p.id = pg.purchaseId
    JOIN goods g ON pg.goodsId = g.id
    WHERE p.userRefNo = ?
    ORDER BY p.createdDateUTC DESC
    LIMIT 10
    `;
    const [rows] = await pool.query(query, [customerId]);
    return rows;
};

/**
 * Hämtar detaljerade köp för de senaste 10 köpen
 * @returns {Promise<Array<object>>} - detaljerade köp
 */
const getRecentPurchasesWithDetails = async () => {
    const query = `
    SELECT p.*, c.firstName, c.lastName, c.userRefNo, g.priceIncVatAfterDiscount AS price, g.type AS goodsType, e.name AS eventName
    FROM Purchase p
    JOIN customer c ON p.userRefNo = c.userRefNo
    JOIN purchasegoods pg ON p.id = pg.purchaseId
    JOIN goods g ON pg.goodsId = g.id
    JOIN purchaseevent pe ON p.id = pe.purchaseId
    JOIN event e ON pe.eventId = e.id
    WHERE p.createdDateUTC >= DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE()) DAY) - INTERVAL 1 MONTH
    AND p.createdDateUTC < DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE()) DAY)
    `;
    const [rows] = await pool.query(query);
    return rows;
};

/**
 * Hämtar totala intäkter för de senaste evenemangen
 * @returns {Promise<Array<object>>} - totala intäkter för evenemangen
 */
const getTotalRevenueByRecentEvents = async () => {
    const query = `
    SELECT e.id AS eventId, e.name AS eventName, e.start, e.end, SUM(g.priceIncVatAfterDiscount) AS totalRevenue
    FROM purchase p
    JOIN purchaseevent pe ON p.id = pe.purchaseId
    JOIN purchasegoods pg ON p.id = pg.purchaseId
    JOIN goods g ON pg.goodsId = g.id 
    JOIN event e ON pe.eventId = e.id  
    WHERE p.status = 'Completed'  
    AND g.type NOT IN ('SeasonToken') 
    GROUP BY e.id, e.name, e.start, e.end
    ORDER BY e.end DESC; 
    `;
    const [rows] = await pool.query(query);
    return rows;
};
//exporterar alla funktioner för att kunna använda dem i andra filer
module.exports = { getAllPurchases, getRecentPurchasesByCustomerId, getRecentPurchasesWithDetails, getTotalRevenueByRecentEvents};