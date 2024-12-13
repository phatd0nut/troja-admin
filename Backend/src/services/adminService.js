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
    return jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET);
};

const updateAdminDetails = async (adminId, newName, newPassword) => {
    const updates = [];
    const params = [];

    if (newName) {
        updates.push('username = ?');
        params.push(newName);
    }

    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updates.push('password = ?');
        params.push(hashedPassword);
    }

    if (updates.length === 0) {
        throw new Error('No updates provided');
    }

    params.push(adminId);

    const query = `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`;
    await pool.query(query, params);
};

module.exports = { createAdmin, findAdminByUsername, generateToken, updateAdminDetails };