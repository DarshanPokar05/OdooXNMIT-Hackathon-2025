import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import Script from 'next/script';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to fetch product details');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    
    if (product.seller._id === user.id) {
      toast.error('You cannot buy your own product');
      return;
    }

    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    if (product.status === 'sold') {
      toast.error('This product is already sold');
      return;
    }

    if (product.seller._id === user.id) {
      toast.error('You cannot buy your own product');
      return;
    }

    // Check if Razorpay is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: product.price * 100,
      currency: 'INR',
      name: 'EcoFinds',
      description: product.title,
      handler: async function (response) {
        console.log('Payment response:', response);
        try {
          // Mark product as sold and create purchase record
          await productAPI.markAsSold(product._id, user.id, response.razorpay_payment_id);
          
          // Redirect to receipt page with payment details
          setTimeout(() => {
            const receiptUrl = `/receipt?productId=${product._id}&paymentId=${response.razorpay_payment_id}&amount=${product.price}&title=${encodeURIComponent(product.title)}`;
            window.location.href = receiptUrl;
          }, 1000);
        } catch (error) {
          console.error('Error marking as sold:', error);
          toast.success('🎉 Payment successful!');
          router.push('/purchase-history');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Back to Home
          </button>
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
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                {product.images && product.images[0] && product.images[0] !== 'https://via.placeholder.com/400x300?text=Product+Image' ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="h-12 w-12 text-emerald-400" />
                    </div>
                    <p className="text-lg text-gray-400">Product Image</p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                {/* Product Title */}
                <h1 className="text-3xl font-bold text-white mb-4">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="text-4xl font-bold text-emerald-400 mb-4">
                  ₹{product.price.toLocaleString()}
                </div>

                {/* Category and Status */}
                <div className="mb-4 flex items-center space-x-3">
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">
                    {product.category}
                  </span>
                  {product.status === 'sold' && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30">
                      SOLD
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  {product.status === 'sold' ? (
                    <div className="w-full bg-red-600/20 text-red-400 py-3 px-6 rounded-lg font-medium text-center border border-red-500/30">
                      This product has been sold
                    </div>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyNow}
                        className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Buy Now
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 border border-gray-600"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}