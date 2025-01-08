const db = require('../config/db'); 

/**
 * Räknar antalet varor som en kund har köpt från databasen
 * @returns {Promise<Map<number, object>>} - en karta med kundens ID som nyckel och antalet varor som värde
 */
const countCustomerPurchasesFromDB = async () => {
    const purchaseCount = new Map();

    const query = `
        SELECT c.firstName, c.lastName, c.email, g.type, COUNT(pg.goodsId) as count
        FROM purchase p
        JOIN purchasegoods pg ON p.id = pg.purchaseId
        JOIN goods g ON pg.goodsId = g.id
        JOIN customer c ON p.userRefNo = c.userRefNo
        GROUP BY c.userRefNo, g.type
    `;

    try {
        const results = await db.query(query);
       // console.log('Query Results:', results[0]); 

        results[0].forEach(row => {
            const customerInfo = {
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email
            };
            const type = row.type;
            const count = row.count;

           // console.log(`Processing: customer=${customerInfo.firstName} ${customerInfo.lastName}, type=${type}, count=${count}`); 

            if (!purchaseCount.has(customerInfo.email)) {
                purchaseCount.set(customerInfo.email, { ...customerInfo, purchases: {} });
            }
            const currentCount = purchaseCount.get(customerInfo.email).purchases;
            currentCount[type] = (currentCount[type] || 0) + count; 
        });

       // console.log('Final Purchase Count:', purchaseCount); 
    } catch (error) {
        console.error('Error fetching customer purchases:', error);
    }

    
    const purchaseCountObject = {};
    purchaseCount.forEach((value, key) => {
        purchaseCountObject[key] = value;
    });

    return purchaseCountObject; 
};

module.exports = { countCustomerPurchasesFromDB };