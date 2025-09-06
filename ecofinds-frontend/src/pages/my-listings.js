import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductListingCard = ({ product, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
  >
    {/* Product Image */}
    <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center relative overflow-hidden">
      {product.images && product.images[0] && product.images[0] !== 'https://via.placeholder.com/400x300?text=Product+Image' ? (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="text-sm text-gray-400">Product Image</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800/20 to-transparent"></div>
    </div>
    
    <div className="p-4">
      {/* Product Title */}
      <h3 className="font-semibold text-white mb-2 line-clamp-2">
        {product.title}
      </h3>
      
      {/* Category */}
      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium border border-emerald-500/30 mb-3 inline-block">
        {product.category}
      </span>
      
      {/* Price */}
      <div className="text-2xl font-bold text-emerald-400 mb-4">
        ₹{product.price.toLocaleString()}
      </div>
      
      {/* Status */}
      <div className="mb-4">
        <span className={`text-xs px-2 py-1 rounded-full ${
          product.status === 'available' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {product.status || 'Available'}
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        {product.status === 'sold' ? (
          <div className="flex-1 bg-gray-600 text-gray-400 py-2 px-3 rounded-lg text-center text-sm">
            Product Sold
          </div>
        ) : (
          <>
            <Link
              href={`/edit-product/${product._id}`}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
            
            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  </motion.div>
);

export default function MyListings() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const response = await productAPI.getMyProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch your listings');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const product = products.find(p => p._id === productId);
    const confirmMessage = `Are you sure you want to delete "${product?.title}"?\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await productAPI.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Please login</h2>
          <Link
            href="/login"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Listings</h1>
            <p className="text-gray-400">Manage your product listings</p>
          </div>
          
          <Link
            href="/add-product"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-700">
              <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">No listings yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start selling by creating your first product listing and reach thousands of eco-conscious buyers
              </p>
              <Link
                href="/add-product"
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Listing</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{products.length}</div>
                  <div className="text-gray-400 text-sm">Total Listings</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {products.filter(p => p.status === 'available').length}
                  </div>
                  <div className="text-gray-400 text-sm">Active</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    ₹{products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Total Value</div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductListingCard
                    product={product}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}