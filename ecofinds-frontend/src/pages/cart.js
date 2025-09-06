import { motion } from 'framer-motion';
import { Leaf, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Script from 'next/script';

const CartItemCard = ({ item, onRemove, onCheckout }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700"
  >
    <div className="flex items-start space-x-4">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {item.images && item.images[0] && item.images[0] !== 'https://via.placeholder.com/400x300?text=Product+Image' ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Leaf className="h-8 w-8 text-emerald-400" />
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-2">
          {item.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-2">
          Category: {item.category}
        </p>
        
        <div className="text-2xl font-bold text-emerald-400 mb-4">
          ₹{item.price.toLocaleString()}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCheckout(item._id)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Checkout
          </motion.button>
          
          <button
            onClick={() => onRemove(item._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, removeFromCart } = useCart();

  const handleCheckout = (productId) => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    const item = cartItems.find(item => item._id === productId);
    if (!item) return;

    if (item.status === 'sold') {
      toast.error('This product is already sold');
      removeFromCart(productId);
      return;
    }

    // Check if Razorpay is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: item.price * 100,
      currency: 'INR',
      name: 'EcoFinds',
      description: item.title,
      handler: async function (response) {
        console.log('Payment response:', response);
        try {
          // Mark product as sold and create purchase record
          await productAPI.markAsSold(productId, user.id, response.razorpay_payment_id);
          removeFromCart(productId);
          
          // Redirect to receipt page with payment details
          const receiptUrl = `/receipt?productId=${productId}&paymentId=${response.razorpay_payment_id}&amount=${item.price}&title=${encodeURIComponent(item.title)}`;
          window.location.href = receiptUrl;
        } catch (error) {
          console.error('Error marking as sold:', error);
          removeFromCart(productId);
          toast.success('🎉 Payment successful!');
        }
      },
      prefill: {
        name: user.username,
        email: user.email,
        contact: '9999999999'
      },
      theme: {
        color: '#16a34a'
      },
      modal: {
        ondismiss: function() {
          toast.error('❌ Payment cancelled');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      toast.error('Failed to open payment gateway');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login</h2>
          <Link
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">EcoFinds</h1>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
                <Link
                  href="/"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CartItemCard
                    item={item}
                    onRemove={removeFromCart}
                    onCheckout={handleCheckout}
                  />
                </motion.div>
              ))}

              {/* Cart Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Total Items: {cartItems.length}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Checkout each item individually
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">
                    ₹{getTotalPrice().toLocaleString()}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}