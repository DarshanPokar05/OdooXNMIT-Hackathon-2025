const Review = require('../models/Review');
const Order = require('../models/Order');
const { calculateTrustScore } = require('../utils/trustScore');

const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const reviewerId = req.user._id;

        // Check if user has purchased this product
        const order = await Order.findOne({
            buyer: reviewerId,
            product: productId,
            status: 'completed'
        }).populate('product');

        if (!order) {
            return res.status(400).json({ message: 'You can only review products you have purchased' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            reviewer: reviewerId,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({
            reviewer: reviewerId,
            reviewee: order.product.seller,
            product: productId,
            rating,
            comment
        });

        await review.save();

        // Update seller's trust score
        await calculateTrustScore(order.product.seller);

        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate('reviewer', 'username profileImage')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const reviews = await Review.find({ reviewee: userId })
            .populate('reviewer', 'username profileImage')
            .populate('product', 'title images')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createReview, getProductReviews, getUserReviews };