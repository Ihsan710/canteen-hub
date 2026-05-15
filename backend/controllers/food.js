const FoodItem = require('../models/FoodItem');

exports.getAllFood = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.isSpecial) filters.isSpecial = req.query.isSpecial === 'true';

    const food = await FoodItem.find(filters);
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createFood = async (req, res) => {
  try {
    const newFood = new FoodItem(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await FoodItem.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
