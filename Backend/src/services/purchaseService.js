const pool = require('../config/db');
/**
 * Hämtar alla köp från databasen
 * @returns {Promise<Array<object>>} - alla köp
 */
const getAllPurchases = async () => {
    const [rows] = await pool.query('SELECT * FROM Purchase');
    return rows;
};

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
module.exports = { getAllPurchases, getRecentPurchasesByCustomerId };