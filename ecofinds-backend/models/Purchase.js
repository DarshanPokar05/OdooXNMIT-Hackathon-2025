const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderAmount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' }
});

module.exports = mongoose.model('Purchase', purchaseSchema);