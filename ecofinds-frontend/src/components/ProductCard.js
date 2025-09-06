import { motion } from 'framer-motion';
import { Leaf, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <Link href={`/product/${product._id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-emerald-500/50"
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/20 to-transparent"></div>
        </div>
        
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-white mb-2 line-clamp-2 text-lg">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="text-2xl font-bold text-emerald-400 mb-3">
            ₹{product.price.toLocaleString()}
          </div>
          
          {/* Category and Cart Button */}
          <div className="flex items-center justify-between">
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
              {product.category}
            </span>
            
            {user && (
              <button
                onClick={handleAddToCart}
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/25"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}