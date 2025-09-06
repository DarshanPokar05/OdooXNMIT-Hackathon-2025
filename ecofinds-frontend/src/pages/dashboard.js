import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Leaf, Edit, ShoppingBag, DollarSign, Recycle, Package, History } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { userAPI, productAPI, purchaseAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, title, value, color, loading }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        {loading ? (
          <div className="w-16 h-8 bg-gray-700 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ type, title, date, amount, status }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        type === 'purchase' ? 'bg-emerald-500' : 'bg-blue-500'
      }`}>
        {type === 'purchase' ? (
          <ShoppingBag className="h-5 w-5 text-white" />
        ) : (
          <DollarSign className="h-5 w-5 text-white" />
        )}
      </div>
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-gray-400 text-sm">{type} • {date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-white font-semibold">₹{amount}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${
        status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
        status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
        'bg-yellow-500/20 text-yellow-400'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSales: 0,
    itemsRecycled: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        profileImage: user.profileImage || ''
      });
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setStatsLoading(true);
    try {
      // Fetch real-time data
      const [productsRes, purchasesRes] = await Promise.all([
        productAPI.getMyProducts().catch(() => ({ data: [] })),
        purchaseAPI.getMyPurchases().catch(() => ({ data: [] }))
      ]);

      const products = productsRes.data || [];
      const purchases = purchasesRes.data || [];

      // Calculate real stats
      const totalSales = products.filter(p => p.status === 'sold').reduce((sum, product) => sum + (product.price || 0), 0);
      const totalPurchases = purchases.reduce((sum, purchase) => sum + (purchase.orderAmount || 0), 0);
      const itemsRecycled = products.length + purchases.length;

      setStats({
        totalPurchases,
        totalSales,
        itemsRecycled
      });

      setMyProducts(products);
      setMyPurchases(purchases);

      // Create recent activity from real data
      const activity = [
        ...products.filter(p => p.status === 'sold').slice(0, 2).map(product => ({
          type: 'sale',
          title: product.title,
          date: new Date(product.soldAt || product.createdAt).toLocaleDateString(),
          amount: product.price,
          status: 'completed'
        })),
        ...purchases.slice(0, 2).map(purchase => ({
          type: 'purchase',
          title: purchase.product?.title || 'Product',
          date: new Date(purchase.purchaseDate).toLocaleDateString(),
          amount: purchase.orderAmount,
          status: 'completed'
        }))
      ].slice(0, 4);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userAPI.updateProfile({
        username: formData.username,
        profileImage: formData.profileImage
      });
      await fetchUser();
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'purchases':
        return (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-6">My Purchases</h3>
            {myPurchases.length === 0 ? (
              <p className="text-gray-400">No purchases yet</p>
            ) : (
              <div className="space-y-4">
                {myPurchases.map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{purchase.product?.title || 'Product'}</p>
                      <p className="text-gray-400 text-sm">{new Date(purchase.purchaseDate || purchase.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-semibold">₹{purchase.orderAmount || purchase.product?.price || 0}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'listings':
        return (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">My Listings</h3>
              <Link
                href="/add-product"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add Product
              </Link>
            </div>
            {myProducts.length === 0 ? (
              <p className="text-gray-400">No listings yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProducts.map((product, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{product.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold">₹{product.price}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.status === 'available' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-6">Profile Settings</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                {editing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300">
                    {formData.username}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-500">
                  {formData.email}
                </div>
              </div>

              {editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                  <ImageUpload
                    onImageUpload={(imageUrl) => setFormData({...formData, profileImage: imageUrl})}
                    currentImage={formData.profileImage}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}

              {editing ? (
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        );

      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={ShoppingBag}
                title="Total Purchases"
                value={`₹${stats.totalPurchases.toLocaleString()}`}
                color="bg-emerald-500"
                loading={statsLoading}
              />
              <StatCard
                icon={DollarSign}
                title="Total Sales"
                value={`₹${stats.totalSales.toLocaleString()}`}
                color="bg-blue-500"
                loading={statsLoading}
              />
              <StatCard
                icon={Recycle}
                title="Items Recycled"
                value={stats.itemsRecycled}
                color="bg-yellow-500"
                loading={statsLoading}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold text-lg mb-6">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <p className="text-gray-400">No recent activity</p>
              ) : (
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                  ))}
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-emerald-400">{user.username}</span>
          </h1>
          <p className="text-gray-400">Manage your marketplace activity and profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mx-auto">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg mt-3">{user.username}</h3>
                <p className="text-gray-400 text-sm">@{user.username?.toLowerCase()}</p>
                <p className="text-gray-500 text-xs mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'purchases' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Purchases
                </button>
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'listings' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  My Listings
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Profile
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}