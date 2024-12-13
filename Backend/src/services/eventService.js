const pool = require('../config/db');

const getAllEvents = async () => {
    const [rows] = await pool.query('SELECT * FROM Event'); 
    return rows;
};

module.exports = { getAllEvents };