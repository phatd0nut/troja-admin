/**
 * cleanupService.js är en fil som innehåller funktioner för att rensa databasen
 */

const pool = require('../config/db');

/**
 * Tar bort kunder som inte har handlat på 2 år.
 * @returns {Promise<void>}
 */
const removeOldUsers = async () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    try {
        await pool.query('START TRANSACTION');

        const [customers] = await pool.query(
            `SELECT id, userRefNo FROM customer WHERE addition_date < ?`,
            [twoYearsAgo]
        );

        const customerIds = customers.map(customer => customer.id);
        const userRefNos = customers.map(customer => customer.userRefNo);

        if (customerIds.length > 0) {
            const purchaseResult = await pool.query(
                `DELETE FROM purchase WHERE userRefNo IN (?)`,
                [userRefNos]
            );

            const deletedPurchaseIds = purchaseResult[0]?.affectedRows || 0;

            await pool.query(
                `DELETE FROM purchasegoods WHERE purchaseId IN (SELECT id FROM purchase WHERE userRefNo IN (?))`,
                [userRefNos]
            );

            await pool.query(
                `DELETE FROM purchaseevent WHERE purchaseId IN (SELECT id FROM purchase WHERE userRefNo IN (?))`,
                [userRefNos]
            );

            const result = await pool.query(
                `DELETE FROM customer WHERE id IN (?)`,
                [customerIds]
            );

            const affectedRows = result[0]?.affectedRows || result.affectedRows || 0;
            console.log(`Removed ${affectedRows} old users and their related data from the database.`);
        } else {
            console.log('No old users to remove.');
        }

        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error removing old users:', error.message);
    }
};
//exporterar removeOldUsers för att kunna använda den i andra filer
module.exports = { removeOldUsers };