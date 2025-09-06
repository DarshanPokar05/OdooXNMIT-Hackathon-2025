const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { calculateTrustScore } = require('../utils/trustScore');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'GiZ3WZbxaM8bVciFqeCciOpf'
});

const createOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.status !== 'available') {
            return res.status(400).json({ message: 'Product is not available' });
        }

        if (product.seller.toString() === buyerId.toString()) {
            return res.status(400).json({ message: 'Cannot buy your own product' });
        }

        const options = {
            amount: product.price * 100, // Amount in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Create order in database
        const order = new Order({
            buyer: buyerId,
            product: productId,
            orderAmount: product.price,
            razorpayOrderId: razorpayOrder.id,
            status: 'pending'
        });

        await order.save();

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        // Update order status
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
            .populate('product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentId = razorpay_payment_id;
        order.status = 'completed';
        await order.save();

        // Mark product as sold
        await Product.findByIdAndUpdate(order.product._id, { status: 'sold' });

        // Update seller's trust score
        await calculateTrustScore(order.product.seller);

        res.json({
            message: 'Payment verified successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createOrder, verifyPayment };