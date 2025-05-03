const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/users/check-registration/:mobileNumber
// @desc    Check if a phone number is registered
// @access  Public
router.get('/check-registration/:mobileNumber', async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    console.log('Checking registration for number:', mobileNumber);
    console.log('Number type:', typeof mobileNumber);
    console.log('Number length:', mobileNumber.length);
    
    // Validate mobile number format
    if (!mobileNumber || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      console.log('Invalid mobile number format:', mobileNumber);
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid mobile number format' 
      });
    }

    // Find user in database
    const user = await User.findOne({ mobileNumber });
    console.log('Database query result:', user);
    console.log('Query used:', { mobileNumber });
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ 
        success: false,
        msg: 'Number not registered. Please sign up first.',
        isRegistered: false 
      });
    }

    // Return success if user exists
    console.log('User found:', user.mobileNumber);
    res.json({ 
      success: true,
      isRegistered: true,
      msg: 'Number is registered'
    });
  } catch (err) {
    console.error('Error checking registration:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Server error', 
      error: err.message 
    });
  }
});

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    console.log('Registering number:', mobileNumber);
    
    // Validate mobile number
    if (!mobileNumber || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      console.log('Invalid mobile number format:', mobileNumber);
      return res.status(400).json({ 
        success: false,
        msg: 'Please enter a valid 10-digit mobile number' 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ mobileNumber });
    console.log('Existing user check:', user);
    
    if (user) {
      console.log('User already exists:', user.mobileNumber);
      return res.status(400).json({ 
        success: false,
        msg: 'User already exists' 
      });
    }

    // Create new user with only required fields
    const temporaryPasscode = Math.floor(1000 + Math.random() * 9000).toString();
    user = new User({
      mobileNumber,
      passcode: await bcrypt.hash(temporaryPasscode, 10),
      isPhoneVerified: true // Firebase already verified
    });

    try {
      await user.save();
      console.log('New user created:', user.mobileNumber);
      
      res.status(201).json({ 
        success: true,
        msg: 'User registered successfully' 
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      
      // If it's a duplicate key error, check if it's for mobile number
      if (saveError.code === 11000) {
        const keyPattern = Object.keys(saveError.keyPattern || {});
        if (keyPattern.includes('mobileNumber')) {
          return res.status(400).json({
            success: false,
            msg: 'This mobile number is already registered'
          });
        }
      }
      
      throw saveError; // Re-throw other errors
    }
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Server error', 
      error: err.message 
    });
  }
});

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passcode');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 