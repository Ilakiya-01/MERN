const express = require('express');
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

const router = express.Router();

// Initialize Stripe only if the key is provided
let stripe;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key_here') {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact the administrator.',
      });
    }

    const { amount, currency = 'usd', productId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency,
      metadata: {
        userId: req.user._id.toString(),
        productId: productId,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Confirm payment and save transaction
// @route   POST /api/payments/confirm-payment
// @access  Private
router.post('/confirm-payment', protect, async (req, res) => {
  try {
    const { paymentIntentId, productId } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({ paymentIntentId });
    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: 'Transaction already exists',
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      amount: product.price,
      product: productId,
      buyer: req.user._id,
      seller: product.owner,
      paymentIntentId,
      status: 'completed',
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get user transaction history
// @route   GET /api/payments/transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate('product', 'title price images')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
