const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Seller');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, phone,  password } = req.body;

    if (!firstname || !lastname || !email || !phone ||  !password) {
      res.status(400);
      return res.json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      return res.json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstname, lastname, email, phone,  password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id,email:email,firstname:firstname }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return res.json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return res.json({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      return res.json({ error: 'Invalid login credentials' });
    }

    // Include user  in the payload
    const payload = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
    res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
