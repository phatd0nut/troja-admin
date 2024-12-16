/**
 * mattar in data från en JSON-fil till databasen
 */
const fs = require("fs").promises;
const path = require("path");
const pool = require("../config/db");

const filePath = path.join(__dirname, "../data/tempData.json");

/**
 * Inserts data from a JSON file into the database
 */
const insertDataFromJson = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const purchases = JSON.parse(data);

        if (!Array.isArray(purchases)) {
            throw new Error("JSON data is not an array.");
        }

        console.log(`Total purchases to process: ${purchases.length}`);

        const sortedPurchases = sortPurchasesByDate(purchases);

        for (const purchase of sortedPurchases) {
            await pool.query('BEGIN');

            try {
                const customerId = await insertOrUpdateCustomer(purchase);
                const purchaseId = await insertOrUpdatePurchase(purchase, customerId);

                await insertOrUpdateEvents(purchase.events, purchaseId);
                await insertOrUpdateGoods(purchase.goods, purchaseId);
                await insertOrUpdateCampaigns(purchase.campaigns, purchaseId);

                await pool.query('COMMIT');
                console.log(`Successfully inserted purchase with crmId: ${purchase.Crmid}`);
            } catch (innerError) {
                await pool.query('ROLLBACK');
                console.error("Transaction rolled back due to error:", innerError.message, innerError.stack);
            }
        }

        console.log(`All data inserted into the database.`);
    } catch (error) {
        console.error("Error inserting data from JSON:", error.message, error.stack);
    }
};

/**
 * Sorterar köpen efter datum
 * @param {Array<object>} purchases - köpen
 * @returns {Array<object>} - sorterade köpen
 */
const sortPurchasesByDate = (purchases) => {
    return purchases.sort((a, b) => {
        const dateA = new Date(a.createdUtc);
        const dateB = new Date(b.createdUtc);
        return dateA - dateB;
    });
};

/**
 * matar in kunderna i databasen
 * @param {object} purchase - köpet
 * @returns {Promise<number>} - kundens ID
 */
const insertOrUpdateCustomer = async (purchase) => {
    const {
        userrefno: userRefNo,
        firstname: firstName,
        lastname: lastName,
        email,
        mobilePhoneNo: phoneNumber,
        acceptInfo,
        postalAddressLineOne: postalAddress,
        zipcode,
        city,
        isCompany,
        companyName
    } = purchase;

    if (!userRefNo || !firstName || !lastName || !email) {
        throw new Error(`Missing required fields in purchase with Crmid: ${purchase.Crmid}`);
    }

    const [userResult] = await pool.query(
        `INSERT INTO \`Customer\` 
        (userRefNo, firstName, lastName, email, phoneNumber, postalAddress, zipcode, city, isCompany, companyName, acceptInfo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            firstName = VALUES(firstName),
            lastName = VALUES(lastName),
            email = VALUES(email),
            phoneNumber = VALUES(phoneNumber),
            postalAddress = VALUES(postalAddress),
            zipcode = VALUES(zipcode),
            city = VALUES(city),
            isCompany = VALUES(isCompany),
            companyName = VALUES(companyName),
            acceptInfo = VALUES(acceptInfo)`,
        [
            userRefNo,
            firstName,
            lastName,
            email,
            phoneNumber,
            postalAddress,
            zipcode,
            city,
            isCompany ? 1 : 0,
            companyName,
            acceptInfo ? 1 : 0
        ]
    );

    if (userResult.insertId) {
        return userResult.insertId;
    } else {
        const [customerRows] = await pool.query(
            `SELECT id FROM \`Customer\` WHERE userRefNo = ?`,
            [userRefNo]
        );
        if (customerRows.length > 0) {
            return customerRows[0].id;
        } else {
            throw new Error(`No customer found with userRefNo: ${userRefNo}`);
        }
    }
};

/**
 * matar in köpen i databasen
 * @param {object} purchase - köpet
 * @param {number} customerId - kundens ID
 * @returns {Promise<number>} - köpets ID
 */
const insertOrUpdatePurchase = async (purchase, customerId) => {
    const {
        Crmid: crmId,
        status,
        userrefno: userRefNo,
        createdUtc
    } = purchase;

    if (!crmId || !status || !userRefNo || !createdUtc) {
        throw new Error(`Missing required fields in purchase with Crmid: ${crmId}`);
    }

    const [purchaseResult] = await pool.query(
        `INSERT INTO \`Purchase\` 
        (crmId, userRefNo, status, createdDateUTC)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            status = VALUES(status),
            createdDateUTC = VALUES(createdDateUTC)`,
        [
            crmId.toString(),
            userRefNo,
            status,
            createdUtc
        ]
    );

    if (purchaseResult.insertId) {
        return purchaseResult.insertId;
    } else {
        const [purchaseRows] = await pool.query(
            `SELECT id FROM \`Purchase\` WHERE crmId = ?`,
            [crmId.toString()]
        );
        if (purchaseRows.length > 0) {
            return purchaseRows[0].id;
        } else {
            throw new Error(`No purchase found with crmId: ${crmId}`);
        }
    }
};

/**
 * matar in evenemang i databasen
 * @param {Array<object>} events - evenemang
 * @param {number} purchaseId - köpets ID
 */
const insertOrUpdateEvents = async (events, purchaseId) => {
    for (const event of events) {
        const {
            id: eventExternalId,
            name,
            start,
            end,
            address
        } = event;

        if (!eventExternalId || !name || !start) {
            throw new Error(`Missing required fields in event for purchase crmId: ${purchaseId}`);
        }

        const [eventResult] = await pool.query(
            `INSERT INTO \`Event\` 
            (eventId, name, start, \`end\`, address)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                start = VALUES(start),
                \`end\` = VALUES(\`end\`),
                address = VALUES(address)`, 
            [
                eventExternalId,
                name,
                new Date(start),
                end ? new Date(end) : null,
                address || null 
            ]
        );

        let eventId;
        if (eventResult.insertId) {
            eventId = eventResult.insertId;
        } else {
            const [eventRows] = await pool.query(
                `SELECT id FROM \`Event\` WHERE eventId = ?`,
                [eventExternalId]
            );
            if (eventRows.length > 0) {
                eventId = eventRows[0].id;
            } else {
                throw new Error(`No event found with eventId: ${eventExternalId}`);
            }
        }

        await pool.query(
            `INSERT INTO \`PurchaseEvent\` (purchaseId, eventId)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE purchaseId = purchaseId`,
            [purchaseId, eventId]
        );
    }
};

/**
 * matar in varor i databasen
 * @param {Array<object>} goods - varor
 * @param {number} purchaseId - köpets ID
 */
const insertOrUpdateGoods = async (goods, purchaseId) => {
    for (const good of goods) {
        const {
            goodsid,
            name,
            type,
            artno,
            priceIncVatAfterDiscount,
            eventId: eventExternalId
        } = good;

        if (!goodsid || !name || !priceIncVatAfterDiscount) {
            throw new Error(`Missing required fields in goods for purchase crmId: ${purchaseId}`);
        }

        let eventId = null;
        if (eventExternalId && eventExternalId.trim() !== '') {
            const [eventRows] = await pool.query(
                `SELECT id FROM \`Event\` WHERE eventId = ?`,
                [eventExternalId]
            );
            if (eventRows.length > 0) {
                eventId = eventRows[0].id;
            } else {
                console.warn(`No event found with eventId: ${eventExternalId} for goods: ${goodsid}`);
            }
        }

        const [goodsResult] = await pool.query(
            `INSERT INTO \`Goods\` 
            (goodsid, name, type, artNo, priceIncVatAfterDiscount, eventId)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                type = VALUES(type),
                artNo = VALUES(artNo),
                priceIncVatAfterDiscount = VALUES(priceIncVatAfterDiscount),
                eventId = VALUES(eventId)`,
            [
                goodsid,
                name,
                type,
                artno || null,
                parseFloat(priceIncVatAfterDiscount) || 0,
                eventId
            ]
        );

        let goodsId;
        if (goodsResult.insertId) {
            goodsId = goodsResult.insertId;
        } else {
            const [goodsRows] = await pool.query(
                `SELECT id FROM \`Goods\` WHERE goodsid = ?`,
                [goodsid]
            );
            if (goodsRows.length > 0) {
                goodsId = goodsRows[0].id;
            } else {
                throw new Error(`No goods found with goodsid: ${goodsid}`);
            }
        }

        await pool.query(
            `INSERT INTO \`PurchaseGoods\` (purchaseId, goodsId)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE purchaseId = purchaseId`,
            [purchaseId, goodsId]
        );
    }
};

/**
 * matar in kampanjer i databasen
 * @param {Array<object>} campaigns - kampanjer
 * @param {number} purchaseId - köpets ID
 */
const insertOrUpdateCampaigns = async (campaigns, purchaseId) => {
    for (const campaign of campaigns) {
        const {
            communicationId,
            internalReference,
            activationCode
        } = campaign;

        if (!communicationId && !internalReference && !activationCode) {
            throw new Error(`Missing required fields in campaign for purchase crmId: ${purchaseId}`);
        }

        await pool.query(
            `INSERT INTO \`Campaign\` 
            (purchaseId, communicationId, internalReference, activationCode)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                communicationId = VALUES(communicationId),
                internalReference = VALUES(internalReference),
                activationCode = VALUES(activationCode)`,
            [
                purchaseId,
                communicationId || null,
                internalReference || null,
                activationCode || null
            ]
        );
    }
};

module.exports = { insertDataFromJson };