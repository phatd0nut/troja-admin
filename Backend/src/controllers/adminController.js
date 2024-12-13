const { createAdmin, findAdminByUsername, generateToken } = require('../services/adminService');
const bcrypt = require('bcrypt');

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const adminUser = await findAdminByUsername(username);

    if (adminUser && await bcrypt.compare(password, adminUser.password)) {
        const token = generateToken(adminUser);
        res.status(200).json({ message: 'Login successful', token, username: adminUser.username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const newAdminId = await createAdmin(username, password);
        res.status(201).json({ message: 'Admin created', adminId: newAdminId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
};

const fetchData = async (req, res) => {
    res.status(200).json({ message: 'Data fetched successfully' });
};

module.exports = { adminLogin, registerAdmin, fetchData };