/**
 * AdminService.js är en fil som innehåller funktioner för att hantera admin-relaterade uppgifter
 * @module AdminService
 */

const pool = require('../config/db'); //importerar pool för att kunna komma åt databasen
const bcrypt = require('bcrypt'); //importerar bcrypt för att kunna hasha lösenord
const jwt = require('jsonwebtoken'); //importerar jwt för att kunna skapa en token

/**
 * Skapar en admin i databasen
 * @param {string} username - användarnamnet för adminen
 * @param {string} password - lösenordet för adminen
 * @returns {Promise<number>} - det nya admin-id:t
 */
const createAdmin = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return result.insertId;
};

/**
 * Hämtar en admin från databasen baserat på användarnamnet
 * @param {string} username - användarnamnet för adminen
 * @returns {Promise<object>} - adminen
 */
const findAdminByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
};

/**
 * Skapar en token för en admin
 * @param {object} admin - adminen
 * @returns {string} - tokenen
 */
const generateToken = (admin) => {
    return jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET);
};

/**
 * Uppdaterar adminens detaljer i databasen
 * @param {number} adminId - adminens id
 * @param {string} newName - det nya användarnamnet
 * @param {string} newPassword - det nya lösenordet
 */
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
//exporterar funktionerna för att kunna använda dem i andra filer
module.exports = { createAdmin, findAdminByUsername, generateToken, updateAdminDetails };