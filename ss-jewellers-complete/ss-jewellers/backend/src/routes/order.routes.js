const express = require('express');
const router  = express.Router();
const order   = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/',             protect,              order.placeOrder);
router.get ('/my',           protect,              order.getMyOrders);
router.get ('/',             protect, adminOnly,   order.getAllOrders);
router.get ('/:id',          protect,              order.getOrderById);
router.put ('/:id/cancel',   protect,              order.cancelOrder);
router.put ('/:id/status',   protect, adminOnly,   order.updateOrderStatus);

module.exports = router;
