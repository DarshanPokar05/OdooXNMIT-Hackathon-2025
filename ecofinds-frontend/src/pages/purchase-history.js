import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, CreditCard, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { purchaseAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PurchaseCard = ({ purchase }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700"
  >
    <div className="flex items-start space-x-4">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {purchase.product?.images && purchase.product.images[0] && purchase.product.images[0] !== 'https://via.placeholder.com/400x300?text=Product+Image' ? (
          <img
            src={purchase.product.images[0]}
            alt={purchase.product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Leaf className="h-8 w-8 text-emerald-400" />
        )}
      </div>
      
      {/* Purchase Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-2">
          {purchase.product?.title || 'Product Name'}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(purchase.purchaseDate || Date.now()).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Package className="h-4 w-4" />
            <span>{purchase.product?.category || 'Category'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-400">
            ₹{(purchase.orderAmount || purchase.product?.price || 0).toLocaleString()}
          </div>
          
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              {purchase.status === 'completed' ? 'Paid' : 'Completed'}
            </span>
          </div>
        </div>
        
        {purchase.paymentId && (
          <div className="mt-2 text-xs text-gray-500">
            Payment ID: {purchase.paymentId}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default function PurchaseHistory() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const response = await purchaseAPI.getMyPurchases();
      console.log('Purchase history response:', response.data);
      setPurchases(response.data || []);
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">EcoFinds</h1>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Previous Purchases</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
              <p className="text-gray-400 mb-6">Start shopping to see your purchase history</p>
              <Link
                href="/"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        ) : (
          /* List View of Purchased Products */
          <div className="space-y-6">
            {purchases.map((purchase, index) => (
              <motion.div
                key={purchase._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PurchaseCard purchase={purchase} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}