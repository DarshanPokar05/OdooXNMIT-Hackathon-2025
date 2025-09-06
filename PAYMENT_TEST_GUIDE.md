# 💳 Payment Testing Guide

## ✅ **Test Cards for Demo:**

### Success Cards:
- **Card**: `4111 1111 1111 1111`
- **Expiry**: `12/25` (any future date)
- **CVV**: `123` (any 3 digits)
- **Name**: Any name

### Other Working Cards:
- **Visa**: `4111 1111 1111 1111`
- **Mastercard**: `5555 5555 5555 4444`
- **Rupay**: `6076 6200 0000 0008`

### UPI Test:
- **UPI ID**: `success@razorpay`
- **PIN**: Any 4-6 digits

## 🔧 **Troubleshooting:**

### If Payment Modal Doesn't Open:
1. **Refresh the page** - Razorpay script might not be loaded
2. **Check browser console** for errors
3. **Try different browser** (Chrome recommended)
4. **Disable ad blockers** temporarily

### If "Payment system not loaded" error:
1. **Wait 2-3 seconds** after page load
2. **Check internet connection**
3. **Refresh the page**

## 🎯 **Demo Flow:**
1. **Login** → Browse products
2. **Click "Buy Now"** → Wait for modal
3. **Select "Card"** payment method
4. **Enter test card**: `4111 1111 1111 1111`
5. **Expiry**: `12/25`, **CVV**: `123`
6. **Click Pay** → Success!

## 🚀 **For Hackathon Demo:**
- Use test card: `4111 1111 1111 1111`
- Always works in demo mode
- Shows professional payment flow
- No real money involved

**Payment should work now! 💳✨**