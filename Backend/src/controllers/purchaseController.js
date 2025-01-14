/**
 * purchaseController.js är en fil som innehåller funktioner för att hantera köp i och från databasen
 */
const { getAllPurchases } = require('../services/purchaseService');
const { countCustomerPurchasesFromDB } = require('../util/databaseUtils');
const { getRecentPurchasesByCustomerId, getRecentPurchasesWithDetails, getTotalRevenueByRecentEvents } = require('../services/purchaseService');

/**
 * Hämtar alla köp från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchAllPurchases = async (req, res) => {
    try {
        const purchases = await getAllPurchases();
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};

/**
 * Hämtar antalet köp för varje kund från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchCustomerPurchaseCounts = async (req, res) => {
    try {
        const purchaseCounts = await countCustomerPurchasesFromDB();
        res.status(200).json({ purchaseCounts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer purchase counts', error: error.message });
    }
};

/**
 * Hämtar de senaste 10 köpen för en given kund
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchRecentPurchases = async (req, res) => {
    const userRefNo = req.params.userRefNo; 

    try {
        const purchases = await getRecentPurchasesByCustomerId(userRefNo);
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent purchases', error: error.message });
    }
};

/**
 * Hämtar detaljerade köp från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchRecentPurchasesWithDetails = async (req, res) => {
    try {
        const purchases = await getRecentPurchasesWithDetails();
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all purchases with details', error: error.message });
    }
};

/**
 * Hämtar totala intäkter för de senaste evenemangen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchTotalRevenueByRecentEvents= async (req, res) => {
    try {
        const totalRevenue = await getTotalRevenueByRecentEvents();
        res.status(200).json(totalRevenue);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total revenue by recent events', error: error.message });
    }
};

//exporterar fetchAllPurchases, fetchCustomerPurchaseCounts, fetchRecentPurchases, fetchRecentPurchasesWithDetails, fetchTotalRevenueByRecentEvents för att kunna använda dem i andra filer
module.exports = { fetchAllPurchases, fetchCustomerPurchaseCounts, fetchRecentPurchases, fetchRecentPurchasesWithDetails, fetchTotalRevenueByRecentEvents};

