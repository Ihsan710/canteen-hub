const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food');
const { auth, restrictTo } = require('../middlewares/auth');

router.get('/', foodController.getAllFood);
router.get('/:id', foodController.getFoodById);

// Admin only routes
router.use(auth, restrictTo('Admin'));
router.post('/', foodController.createFood);
router.put('/:id', foodController.updateFood);
router.delete('/:id', foodController.deleteFood);

module.exports = router;
