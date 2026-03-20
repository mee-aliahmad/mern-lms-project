const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token with user ID and role
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    // Create user (password is hashed in the pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    // Generate token and respond
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate token and respond
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name and/or password)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, password, currentPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided (requires current password verification)
    if (password) {
      if (!currentPassword) {
        res.status(400);
        throw new Error('Current password is required to set a new password');
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
      }

      user.password = password; // Will be hashed by pre-save hook
    }

    await user.save();

    // Generate new token and respond with updated user data
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
