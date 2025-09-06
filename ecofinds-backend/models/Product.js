const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Other'] 
    },
    images: [{ type: String, required: true }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'available', enum: ['available', 'sold'] },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    soldAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);