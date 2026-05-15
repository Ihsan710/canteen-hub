const Order = require('../models/Order');
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, paymentStatus } = req.body;
    
    // Generate a simple 6-character pickup token
    const pickupToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    const newOrder = new Order({
      userId: req.user.userId,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus,
      pickupToken,
      priority: req.user.role === 'Teacher'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email department').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsPickedUp = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId, status: 'Ready' },
      { status: 'Delivered' },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found or not ready' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
