const express = require('express');
const { getMyPurchases } = require('../controllers/purchaseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/my-purchases', auth, getMyPurchases);

module.exports = router;