const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAdmin = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return result.insertId;
};

const findAdminByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
};

const generateToken = (admin) => {
    return jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
module.exports = { createAdmin, findAdminByUsername, generateToken };