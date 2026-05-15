const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { auth, restrictTo } = require('../middlewares/auth');

// Create complaint
router.post('/', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const complaint = new Complaint({
      userId: req.user.userId,
      subject,
      message
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all complaints (Admin only)
router.get('/', auth, restrictTo('Admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email role').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status
router.put('/:id', auth, restrictTo('Admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
