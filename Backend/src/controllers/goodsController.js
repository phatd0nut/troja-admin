const { getAllGoods } = require('../services/goodsService');

const fetchAllGoods = async (req, res) => {
    try {
        const goods = await getAllGoods();
        res.status(200).json(goods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching goods', error: error.message });
    }
};

module.exports = { fetchAllGoods };