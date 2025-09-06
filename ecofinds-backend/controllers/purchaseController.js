const Purchase = require('../models/Purchase');

const getMyPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({ buyer: req.user._id })
            .populate('product', 'title images price category')
            .populate('seller', 'username')
            .sort({ purchaseDate: -1 });

        res.json(purchases);
    } catch (error) {
        console.error('Purchase fetch error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getMyPurchases };