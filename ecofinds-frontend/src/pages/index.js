import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, ShoppingCart, Users, Package, ShoppingBag, Recycle, Monitor, Sofa, Shirt, Book, Trophy, Home as HomeIcon, Shield, Scale } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const categories = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Other'];

const StatsCard = ({ icon: Icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <div className="text-3xl font-bold text-emerald-400 mb-2">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

const CategoryCard = ({ icon: Icon, title, itemCount }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors cursor-pointer"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
      <Icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{itemCount} items</p>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-white font-semibold mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Get search from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

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
      setProducts(response.data.products || response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold text-white mb-6"
            >
              Discover <span className="text-emerald-400">Sustainable</span>
              <br />
              Second-Hand Treasures
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto"
            >
              Join the circular economy revolution. Buy and sell pre-loved items while
              making a positive environmental impact.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <Link
                href="#products"
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/register"
                className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Join Community
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
            <StatsCard label="Active Users" value="15,742+" />
            <StatsCard label="Products Listed" value="47,291+" />
            <StatsCard label="Successful Sales" value="12,834+" />
            <StatsCard label="CO₂ Saved" value="267kg" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Popular <span className="text-emerald-400">Categories</span>
            </h2>
            <p className="text-gray-400">
              Discover unique items across various categories, all contributing to a
              sustainable future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard icon={Monitor} title="Electronics" itemCount="12.5k" />
            <CategoryCard icon={Sofa} title="Furniture" itemCount="8.2k" />
            <CategoryCard icon={Shirt} title="Clothing" itemCount="18.7k" />
            <CategoryCard icon={Book} title="Books" itemCount="6.9k" />
            <CategoryCard icon={Trophy} title="Sports" itemCount="4.1k" />
            <CategoryCard icon={HomeIcon} title="Home & Garden" itemCount="9.3k" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose <span className="text-emerald-400">EcoFinds</span>
            </h2>
            <p className="text-gray-400">
              We're building the future of sustainable commerce with cutting-edge
              technology and community trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Trust Score System"
              description="Our AI-powered trust scoring ensures safe transactions with verified sellers."
            />
            <FeatureCard
              icon={Scale}
              title="Environmental Impact"
              description="Track your contribution to reducing waste and carbon footprint."
            />
            <FeatureCard
              icon={Search}
              title="Smart Discovery"
              description="AI-powered search helps you find exactly what you need quickly."
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Products</h2>
            {user && (
              <Link
                href="/add-product"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters' 
                  : 'Be the first to list a product!'}
              </p>
              {user && (
                <Link
                  href="/add-product"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add First Product
                </Link>
              )}
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
      </section>
    </div>
  );
}