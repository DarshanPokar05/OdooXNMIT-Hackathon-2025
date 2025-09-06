import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Sofa, Shirt, Book, Trophy, Home as HomeIcon, Search } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const categoryIcons = {
  Electronics: Monitor,
  Furniture: Sofa,
  Clothing: Shirt,
  Books: Book,
  Sports: Trophy,
  Other: HomeIcon
};

const CategoryCard = ({ category, count, isSelected, onClick }) => {
  const Icon = categoryIcons[category] || HomeIcon;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`p-6 rounded-xl cursor-pointer transition-all ${
        isSelected 
          ? 'bg-emerald-600 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
          isSelected ? 'bg-white/20' : 'bg-emerald-500'
        }`}>
          <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-white'}`} />
        </div>
        <h3 className="font-semibold mb-2">{category}</h3>
        <p className={`text-sm ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
          {count} items
        </p>
      </div>
    </motion.div>
  );
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      // Get category counts
      const categoryData = [
        { name: 'Electronics', count: '12.5k' },
        { name: 'Furniture', count: '8.2k' },
        { name: 'Clothing', count: '18.7k' },
        { name: 'Books', count: '6.9k' },
        { name: 'Sports', count: '4.1k' },
        { name: 'Other', count: '9.3k' }
      ];
      setCategories(categoryData);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      const response = await productAPI.getProducts(params);
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Popular <span className="text-emerald-400">Categories</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Discover unique items across various categories, all contributing to a sustainable future.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <CategoryCard
            category="All"
            count="All"
            isSelected={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
          />
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              count={category.count}
              isSelected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search' : `No products in ${selectedCategory} category yet`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}