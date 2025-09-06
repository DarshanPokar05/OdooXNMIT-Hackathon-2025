const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    purchaseDate: { type: Date, default: Date.now },
    orderAmount: { type: Number, required: true },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] }
});

module.exports = mongoose.model('Order', orderSchema);