const { getAllCustomers, getCustomersGroupedByGoods, getCustomersLastMonth, getCustomersLastYear } = require('../services/customerService');

const fetchAllCustomers = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

const fetchCustomersGroupedByGoods = async (req, res) => {
    try {
        const customers = await getCustomersGroupedByGoods();
        res.status(200).json({ customers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers grouped by goods', error: error.message });
    }
};

const fetchCustomersLastMonth = async (req, res) => {
    try {
        const customers = await getCustomersLastMonth();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers from last month', error: error.message });
    }
};

const fetchCustomersLastYear = async (req, res) => {
    try {
        const customers = await getCustomersLastYear();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers from last year', error: error.message });
    }
};

module.exports = { fetchAllCustomers, fetchCustomersGroupedByGoods, fetchCustomersLastMonth, fetchCustomersLastYear };