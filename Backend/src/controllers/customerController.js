/**
 * customerController.js är en fil som innehåller funktioner för att hantera kunder i och från databasen
 */
const { getAllCustomers, getCustomersGroupedByGoods, getCustomersLastMonth, getCustomersLastYear } = require('../services/customerService');

/**
 * Hämtar alla kunder från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchAllCustomers = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

/**
 * Hämtar kunder grupperade efter varor från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchCustomersGroupedByGoods = async (req, res) => {
    try {
        const customers = await getCustomersGroupedByGoods();
        res.status(200).json({ customers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers grouped by goods', error: error.message });
    }
};

/**
 * Hämtar kunder från databasen för de senaste månaden
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchCustomersLastMonth = async (req, res) => {
    try {
        const customers = await getCustomersLastMonth();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers from last month', error: error.message });
    }
};

/**
 * Hämtar kunder från databasen för det senaste året
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchCustomersLastYear = async (req, res) => {
    try {
        const customers = await getCustomersLastYear();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers from last year', error: error.message });
    }
};

//exporterar fetchAllCustomers, fetchCustomersGroupedByGoods, fetchCustomersLastMonth och fetchCustomersLastYear för att kunna använda dem i andra filer
module.exports = { fetchAllCustomers, fetchCustomersGroupedByGoods, fetchCustomersLastMonth, fetchCustomersLastYear };