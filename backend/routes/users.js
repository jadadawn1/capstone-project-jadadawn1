// POST /api/users/register - public registration (MVP: password ignored, role always 'member')
router.post('/register', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  let user = await User.findOne({ email });
  if (user) return res.status(409).json({ message: 'User already exists' });
  user = new User({ email, password: 'changeme', role: 'member' });
  await user.save();
  res.status(201).json({ email: user.email, role: user.role });
});
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Add this to your Express app setup if not already present:
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

// POST /api/login - issues JWT cookie (MVP: no password check, just email)
router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  // For demo: skip password check
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ email: user.email, role: user.role });
});
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');

// GET /api/users - admin only
router.get('/', authenticateJWT, authorize('admin'), async (req, res) => {
  const users = await User.find({}, '-password'); // Exclude password
  res.json(users);
});

// POST /api/users - admin only (create user)
router.post('/', authenticateJWT, authorize('admin'), async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json({ _id: user._id, email: user.email, role: user.role });
});

// DELETE /api/users/:id - admin only
router.delete('/:id', authenticateJWT, authorize('admin'), async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
