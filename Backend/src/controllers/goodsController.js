/**
 * goodsController.js är en fil som innehåller funktioner för att hantera varor i och från databasen
 */
const { getAllGoods } = require('../services/goodsService');

/**
 * Hämtar alla varor från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchAllGoods = async (req, res) => {
    try {
        const goods = await getAllGoods();
        res.status(200).json(goods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goods', error: error.message });
    }
};
//exporterar fetchAllGoods för att kunna använda den i andra filer
module.exports = { fetchAllGoods };