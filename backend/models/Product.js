const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, enum: ['Education', 'Equipment', 'Service', 'Software'], required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  type: { type: String, enum: ['physical', 'digital', 'service'], default: 'physical' },
  stock: { type: Number, default: 0 }, // Services might have 'infinity' stock
  imageUrl: String,
  isActive: { type: Boolean, default: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // For self-referencing sub-categories
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
