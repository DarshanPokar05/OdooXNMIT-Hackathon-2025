const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: 'https://via.placeholder.com/150' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
    trustScore: { type: Number, default: 50 }
});

module.exports = mongoose.model('User', userSchema);