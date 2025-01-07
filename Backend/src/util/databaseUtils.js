const db = require('../config/db'); 

/**
 * Räknar antalet varor som en kund har köpt från databasen
 * @returns {Promise<Map<number, object>>} - en karta med kundens ID som nyckel och antalet varor som värde
 */
const countCustomerPurchasesFromDB = async () => {
    const purchaseCount = new Map();

    const query = `
        SELECT p.crmId, g.type, COUNT(g.id) as count
        FROM purchase p
        JOIN purchasegoods pg ON p.id = pg.purchaseId
        JOIN goods g ON pg.goodsId = g.id
        GROUP BY p.crmId, g.type
    `;

    try {
        const results = await db.query(query);
        console.log('Query Results:', results); // Add this line
        results.forEach(row => {
            const customerId = row.crmId;
            const type = row.type;
            const count = row.count;
 
            if (!purchaseCount.has(customerId)) {
                purchaseCount.set(customerId, {});
            }
            const currentCount = purchaseCount.get(customerId);
            currentCount[type] = (currentCount[type] || 0) + count;
        });
    } catch (error) {
        console.error('Error fetching customer purchases:', error);
    }

    return purchaseCount;
};



module.exports = { countCustomerPurchasesFromDB };