const express = require('express');
const { createReview, getProductReviews, getUserReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/user/:userId', getUserReviews);

module.exports = router;