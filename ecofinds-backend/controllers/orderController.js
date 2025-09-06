const Order = require('../models/Order');
const Purchase = require('../models/Purchase');

const getMyOrders = async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user._id);
        
        // Get from both Order and Purchase models
        const [orders, purchases] = await Promise.all([
            Order.find({ buyer: req.user._id })
                .populate('product', 'title images price category')
                .populate('buyer', 'username')
                .sort({ purchaseDate: -1 }),
            Purchase.find({ buyer: req.user._id })
                .populate('product', 'title images price category')
                .populate('buyer', 'username')
                .sort({ purchaseDate: -1 })
        ]);

        console.log('Orders found:', orders.length);
        console.log('Purchases found:', purchases.length);

        // Combine and sort by date
        const allPurchases = [...orders, ...purchases].sort((a, b) => 
            new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );

        console.log('Total purchases:', allPurchases.length);
        res.json(allPurchases);
    } catch (error) {
        console.error('Order fetch error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMySales = async (req, res) => {
    try {
        const sales = await Order.find()
            .populate({
                path: 'product',
                match: { seller: req.user._id },
                select: 'title images price category seller'
            })
            .populate('buyer', 'username')
            .sort({ purchaseDate: -1 });

        // Filter out orders where product is null (not sold by current user)
        const filteredSales = sales.filter(sale => sale.product !== null);

        res.json(filteredSales);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getMyOrders, getMySales };