const pool = require('../config/db');

/**
 * Tar bort kunder som inte har handlat på 2 år.
 * @returns {Promise<void>}
 */
const removeOldUsers = async () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2); 

    try {
        const result = await pool.query(
            `DELETE FROM Customer WHERE addition_date < ?`,
            [twoYearsAgo]
        );

        const affectedRows = result[0]?.affectedRows || result.affectedRows || 0; 
        console.log(`Removed ${affectedRows} old users from the database.`);
    } catch (error) {
        console.error('Error removing old users:', error.message);
    }
};
/**
 * advanced removeOldUsers 

const removeOldUsers = async () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    try {
        
        await pool.query('START TRANSACTION');

      
        const [customers] = await pool.query(
            `SELECT id FROM customer WHERE addition_date < ?`,
            [twoYearsAgo]
        );

        const customerIds = customers.map(customer => customer.id);

        if (customerIds.length > 0) {
            
            await pool.query(
                `DELETE FROM purchasegoods WHERE purchaseId IN (SELECT id FROM purchase WHERE userRefNo IN (?))`,
                [customerIds]
            );

            await pool.query(
                `DELETE FROM purchaseevent WHERE purchaseId IN (SELECT id FROM purchase WHERE userRefNo IN (?))`,
                [customerIds]
            );

            
            await pool.query(
                `DELETE FROM purchase WHERE userRefNo IN (?)`,
                [customerIds]
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
*/
module.exports = { removeOldUsers };