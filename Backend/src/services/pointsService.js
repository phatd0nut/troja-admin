/**
 * pointsService.js är en fil som innehåller funktioner för att kalkylera och uppdatera poäng för kunder
 */
const pool = require("../config/db");

/**
 * kalkylera och uppdatera poängen för kunderna baserat på köp i databasen.
 * @returns {Promise<void>}
 */
const calculateAndUpdatePointsFromDatabase = async () => {
    try {
        const [purchases] = await pool.query(`
            SELECT p.id, p.crmId, p.userRefNo, p.status, g.priceIncVatAfterDiscount
            FROM purchase p
            JOIN purchasegoods pg ON p.id = pg.purchaseId
            JOIN goods g ON pg.goodsId = g.id
            WHERE p.pointsProcessed = 0
        `);

        for (const purchase of purchases) {
            const { id, userRefNo, status, priceIncVatAfterDiscount } = purchase;
            const price = parseFloat(priceIncVatAfterDiscount) || 0;

            const [customerRows] = await pool.query(
                `SELECT points FROM customer WHERE userRefNo = ?`,
                [userRefNo]
            );

            let currentPoints = 0;
            if (customerRows.length > 0) {
                currentPoints = customerRows[0].points || 0; 
            } else {
                if (status === "Completed") {
                    await addNewCustomerWithPoints(userRefNo, price);
                } else {
                    console.log(`Customer with userRefNo ${userRefNo} does not exist.`);
                }
            }

            let newPoints = currentPoints;

            if (status === "Completed") {
                newPoints += price; 
            } else if (status === "Refunded") {
                newPoints -= price; 
            }

            
            console.log(`UserRefNo: ${userRefNo}, Current Points: ${currentPoints}, New Points: ${newPoints}`);

            
            if (newPoints < 0) {
                console.warn(`Warning: New points for userRefNo ${userRefNo} is negative. Setting to 0.`);
                newPoints = 0; 
            }

            if (newPoints !== currentPoints) {
                await updateCustomerPoints(userRefNo, newPoints);
            }

            await markPurchaseAsProcessed(id); 
        }
    } catch (error) {
        console.error("Error calculating and updating points from database:", error.message);
    }
};

/**
 * markerar ett köp som beräknat för poängberäkning.
 * @param {number} purchaseId - id på köpet.
 * @returns {Promise<void>}
 */
const markPurchaseAsProcessed = async (purchaseId) => {
    try {
        await pool.query(
            `UPDATE purchase SET pointsProcessed = 1 WHERE id = ?`,
            [purchaseId]
        );
        console.log(`Marked purchase ID ${purchaseId} as processed.`);
    } catch (error) {
        console.error(`Error marking purchase ID ${purchaseId} as processed:`, error.message);
    }
};

/**
 * uppdaterar poängen för en kund i databasen.
 * @param {string} userRefNo - kundens unika identifierare.
 * @param {number} points - den nya totala poängen.
 * @returns {Promise<void>}
 */
const updateCustomerPoints = async (userRefNo, points) => {
    try {
        await pool.query(
            `UPDATE customer 
            SET points = ? 
            WHERE userRefNo = ?`,
            [points, userRefNo]
        );
        console.log(`Updated points for userRefNo ${userRefNo}: ${points}`);
    } catch (error) {
        console.error(`Error updating points for userRefNo ${userRefNo}:`, error.message);
    }
};

/**
 * lägger till en ny kund med poäng i databasen.
 * @param {string} userRefNo - kundens unika identifierare.
 * @param {number} points - poängen som tilldelas till den nya kunden.
 * @returns {Promise<void>}
 */
const addNewCustomerWithPoints = async (userRefNo, points) => {
    try {
        await pool.query(
            `INSERT INTO customer (userRefNo, points) VALUES (?, ?)`,
            [userRefNo, points]
        );
        console.log(`Added new customer with userRefNo ${userRefNo} and points ${points}`);
    } catch (error) {
        console.error(`Error adding new customer with userRefNo ${userRefNo}:`, error.message);
    }
};

const calculateCustomerPointsWithAcceptInfo = async () => {
    try {
        const [results] = await pool.query(`
            SELECT 
                SUM(CASE WHEN acceptInfo = 1 THEN points ELSE 0 END) AS totalPointsWithAccept,
                SUM(CASE WHEN acceptInfo = 0 THEN points ELSE 0 END) AS totalPointsWithoutAccept
            FROM customer
        `);
        
        // Format the date as YYYY/MM/DD HH:MM
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const formattedTime = `${year}/${month}/${day} ${hours}:${minutes}`;
        
        const pointsStats = {
            timestamp: formattedTime,
            totalPointsWithAcceptInfo: results[0].totalPointsWithAccept || 0,
            totalPointsWithoutAcceptInfo: results[0].totalPointsWithoutAccept || 0
        };
        
        console.log(`[${formattedTime}] Customer points statistics:`, pointsStats);
        return pointsStats;
    } catch (error) {
        console.error('Error calculating customer points statistics:', error.message);
        throw error;
    }
};

module.exports = { 
    calculateAndUpdatePointsFromDatabase,
    calculateCustomerPointsWithAcceptInfo
};

// Run it once when the module loads
(async () => {
    try {
        await calculateCustomerPointsWithAcceptInfo();
    } catch (error) {
        console.error("Failed to calculate points statistics:", error);
    }
})();