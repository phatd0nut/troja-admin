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

module.exports = { removeOldUsers };