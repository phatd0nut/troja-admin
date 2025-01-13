const { getAllPurchases } = require('../services/purchaseService');
const { countCustomerPurchasesFromDB } = require('../util/databaseUtils');
const { getRecentPurchasesByCustomerId, getRecentPurchasesWithDetails } = require('../services/purchaseService');

const fetchAllPurchases = async (req, res) => {
    try {
        const purchases = await getAllPurchases();
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};


const fetchCustomerPurchaseCounts = async (req, res) => {
    try {
        const purchaseCounts = await countCustomerPurchasesFromDB();
        res.status(200).json({ purchaseCounts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer purchase counts', error: error.message });
    }
};

const fetchRecentPurchases = async (req, res) => {
    const userRefNo = req.params.userRefNo; 

    try {
        const purchases = await getRecentPurchasesByCustomerId(userRefNo);
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent purchases', error: error.message });
    }
};

const fetchRecentPurchasesWithDetails = async (req, res) => {
    try {
        const purchases = await getRecentPurchasesWithDetails();
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all purchases with details', error: error.message });
    }
};


module.exports = { fetchAllPurchases, fetchCustomerPurchaseCounts, fetchRecentPurchases, fetchRecentPurchasesWithDetails };