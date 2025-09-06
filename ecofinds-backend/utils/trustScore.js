const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

const calculateTrustScore = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        // Base score
        let trustScore = 50;

        // +5 for each successful transaction
        const successfulTransactions = await Order.countDocuments({
            $or: [{ buyer: userId }, { seller: userId }],
            status: 'completed'
        });
        trustScore += successfulTransactions * 5;

        // Average rating calculation
        const reviews = await Review.find({ reviewee: userId });
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            trustScore += (avgRating - 3) * 2;
        }

        // +1 for every 30 days of account age
        const accountAgeDays = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
        trustScore += Math.floor(accountAgeDays / 30);

        // Cap the score between 0 and 100
        trustScore = Math.max(0, Math.min(100, Math.round(trustScore)));

        await User.findByIdAndUpdate(userId, { trustScore });
        return trustScore;
    } catch (error) {
        console.error('Error calculating trust score:', error);
    }
};

module.exports = { calculateTrustScore };