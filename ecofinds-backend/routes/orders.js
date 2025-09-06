const express = require('express');
const { getMyOrders, getMySales } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/my-history', auth, getMyOrders);
router.get('/my-sales', auth, getMySales);

module.exports = router;