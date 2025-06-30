const express = require('express');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyAdmin } = require('../utils/auth');
const router = express.Router();

// Test route to check if admin routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!' });
});

// Check if admin exists (for debugging)
router.get('/exists', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: 'admin' });
    res.json({ 
      exists: !!admin,
      message: admin ? 'Admin user exists' : 'Admin user not found'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Admin login attempt for username
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      // Admin not found for username
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      // Password mismatch for admin
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Admin login successful
    
    // Return both token and admin info
    res.json({ 
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all users (admin only)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEMPORARY: Reset credentials for a specific admin (REMOVE after use for security)
router.post('/reset-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const hashed = await bcrypt.hash(password, 10);
    admin.password = hashed;
    await admin.save();
    res.json({ message: 'Admin credentials updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 