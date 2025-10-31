const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  images: [{
    type: String, // URLs or paths to images
  }],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'used'],
    default: 'used',
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create text index for search
productSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
