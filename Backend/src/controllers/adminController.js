const { createAdmin, findAdminByUsername, updateAdminDetails, generateToken } = require('../services/adminService');
const bcrypt = require('bcrypt');

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const adminUser = await findAdminByUsername(username);

    if (adminUser && await bcrypt.compare(password, adminUser.password)) {
        const token = generateToken(adminUser);
        res.status(200).json({ message: 'Login successful', token });
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


const changeAdminDetails = async (req, res) => {
    const { currentPassword, newName, newPassword, confirmPassword } = req.body;
    const adminId = req.user.id; 

    try {
        
        const admin = await findAdminByUsername(req.user.username); 

        
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        
        if (newPassword && newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirmation do not match' });
        }

        
        await updateAdminDetails(adminId, newName, newPassword);
        res.status(200).json({ message: 'Admin details updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin details', error: error.message });
    }
};

const fetchData = async (req, res) => {
    
    res.status(200).json({ message: 'Data fetched successfully' });
};

module.exports = { adminLogin, registerAdmin, changeAdminDetails, fetchData };