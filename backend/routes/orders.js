const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { auth, restrictTo } = require('../middlewares/auth');

router.use(auth);

// Student/Teacher routes
router.post('/', ordersController.createOrder);
router.get('/my-orders', ordersController.getMyOrders);
router.patch('/:id/pickup', ordersController.markAsPickedUp);

// Admin/Teacher routes
router.get('/all', restrictTo('Admin', 'Teacher'), ordersController.getAllOrders);
router.patch('/:id/status', restrictTo('Admin', 'Teacher'), ordersController.updateOrderStatus);

module.exports = router;
