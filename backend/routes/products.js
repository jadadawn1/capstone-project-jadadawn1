const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Product = require('../models/Product');

// GET /api/products - public (search/filter handled by query params)
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter);
  res.json(products);
});

// GET /api/products/:id - public
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// POST /api/products - admin only
router.post('/', authenticateJWT, authorize('admin'), async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// PUT /api/products/:id - admin only
router.put('/:id', authenticateJWT, authorize('admin'), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// DELETE /api/products/:id - admin only
router.delete('/:id', authenticateJWT, authorize('admin'), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
