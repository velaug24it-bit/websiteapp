const crypto = require('crypto');
const User = require('../models/User');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../utils/sendEmail');

// Customer Register
// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password,
    });

    const token = generateToken({ id: user._id, role: 'customer' });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer Login
// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, role: 'customer' });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer Profile
// GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer Cart - Get User Cart
// GET /api/auth/cart
const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('cart');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer Cart - Update User Cart
// PUT /api/auth/cart
const updateUserCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.cart = Array.isArray(cart) ? cart : [];
    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Login
// POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter admin email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateToken({ id: admin._id, role: admin.role });

    res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Profile
// GET /api/admin/profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Admin Profile
// PUT /api/admin/profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase().trim();
    if (password) admin.password = password;

    await admin.save();

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request Password Reset Code
// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check customer accounts first, then admin accounts
    let account = await User.findOne({ email: cleanEmail });
    let accountType = 'customer';

    if (!account) {
      account = await Admin.findOne({ email: cleanEmail });
      accountType = 'admin';
    }

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'No registered account found with this email address. Please check spelling or create an account.',
      });
    }

    // Generate 6-digit verification code
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash token before storing in database
    const hashedToken = crypto.createHash('sha256').update(resetOtp).digest('hex');

    account.resetPasswordToken = hashedToken;
    account.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    await account.save();

    // Send verification code to email
    try {
      await sendPasswordResetEmail({
        to: cleanEmail,
        resetOtp,
        userName: account.name || (accountType === 'admin' ? 'Administrator' : 'Valued Customer'),
      });
      console.log(`[Password Reset] ✉️ Verification code sent to ${cleanEmail}`);
    } catch (emailErr) {
      console.error('[Password Reset] ⚠️ Failed to deliver email:', emailErr.message);
      // We still log for admin audit, but do not leak token to the frontend response
    }

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox.`,
      email: cleanEmail,
      accountType,
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to process password reset request.' });
  }
};

// Verify Code and Set New Password
// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, 6-digit verification code, and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();
    const hashedToken = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    // Search in User collection
    let account = await User.findOne({
      email: cleanEmail,
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    let accountType = 'customer';

    // If not found in User, search in Admin
    if (!account) {
      account = await Admin.findOne({
        email: cleanEmail,
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      accountType = 'admin';
    }

    if (!account) {
      const existing = (await User.findOne({ email: cleanEmail })) || (await Admin.findOne({ email: cleanEmail }));
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Account not found with this email.' });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code. Please request a new code.',
      });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    account.password = newPassword;
    account.resetPasswordToken = null;
    account.resetPasswordExpire = null;
    await account.save();

    console.log(`[Password Reset] ✅ Password successfully updated for ${cleanEmail} (${accountType})`);

    const token = generateToken({ id: account._id, role: account.role || accountType });

    res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now log in.',
      token,
      accountType,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role || accountType,
      },
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to reset password.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserCart,
  updateUserCart,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  forgotPassword,
  resetPassword,
};
