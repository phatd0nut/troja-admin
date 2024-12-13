const { getAllPurchases } = require('../services/purchaseService');

const fetchAllPurchases = async (req, res) => {
    try {
        const purchases = await getAllPurchases();
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};

module.exports = { fetchAllPurchases };