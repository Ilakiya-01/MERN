const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const products = await Product.find(query).populate('owner', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email phone location');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);
    const { title, description, price, category, location, condition } = req.body;

    // Parse price to number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price',
      });
    }

    const images = req.files ? req.files.map(file => file.filename) : [];

    const product = await Product.create({
      title,
      description,
      price: parsedPrice,
      category,
      location,
      condition,
      images,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (owner only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Make sure user is product owner
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const { title, description, price, category, location, condition } = req.body;
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    const images = [...product.images, ...newImages];

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, location, condition, images },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Make sure user is product owner
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// @desc    Mark product as sold
// @route   PATCH /api/products/:id/sold
// @access  Private
router.patch('/:id/sold', protect, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if product is already sold
    if (product.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Product is already sold',
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'sold' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete image from product
// @route   DELETE /api/products/:id/images/:imageName
// @access  Private (owner only)
router.delete('/:id/images/:imageName', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Make sure user is product owner
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to modify this product',
      });
    }

    // Check if product is sold
    if (product.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete images from sold products',
      });
    }

    // Remove image from array
    const imageIndex = product.images.indexOf(req.params.imageName);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    product.images.splice(imageIndex, 1);
    await product.save();

    // Delete file from filesystem
    const imagePath = path.join(__dirname, '../uploads/', req.params.imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
