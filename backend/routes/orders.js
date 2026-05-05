const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Order = require('../models/Order');

// POST /api/orders - member only (checkout)
router.post('/', authenticateJWT, authorize('member'), async (req, res) => {
  const { items, total } = req.body;
  // TODO: Validate stock, snapshot price, etc.
  const order = new Order({ userId: req.user.id, items, total });
  await order.save();
  res.status(201).json(order);
});

// GET /api/orders/myorders - member only
router.get('/myorders', authenticateJWT, authorize('member'), async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

// GET /api/orders/all - admin only
router.get('/all', authenticateJWT, authorize('admin'), async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;
