const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  offer: {
    type: Number, // Percentage discount (0-100)
    default: 0
  },
  isSpecial: {
    type: Boolean, // Today's special
    default: false
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
