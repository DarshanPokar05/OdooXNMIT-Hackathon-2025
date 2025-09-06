import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, 
  User, 
  Plus, 
  Menu, 
  X, 
  Leaf,
  LogOut,
  Package,
  History,
  Settings,
  Search,
  Bell
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EcoFinds</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Marketplace
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Categories
              </Link>
              <Link href="/my-listings" className="text-gray-300 hover:text-emerald-400 transition-colors">
                My Listings
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={(e) => {
                e.preventDefault();
                const searchTerm = e.target.search.value;
                if (searchTerm.trim()) {
                  window.location.href = `/?search=${encodeURIComponent(searchTerm)}`;
                }
              }}>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="search"
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </form>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {mounted && user ? (
                <>
                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-emerald-400 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>

                  {/* Cart */}
                  <Link href="/cart" className="relative p-2 text-gray-400 hover:text-emerald-400 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm font-medium text-white">
                        {user.username}
                      </span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/my-listings"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>My Listings</span>
                        </Link>
                        <Link
                          href="/purchase-history"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <History className="h-4 w-4" />
                          <span>Purchase History</span>
                        </Link>
                        <hr className="my-2 border-gray-700" />
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : mounted ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Ecouser
                  </Link>
                </div>
              ) : null}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/"
                className="block py-2 text-gray-300 hover:text-emerald-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="#categories"
                className="block py-2 text-gray-300 hover:text-emerald-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              {mounted && user && (
                <>
                  <Link
                    href="/add-product"
                    className="block py-2 text-gray-300 hover:text-emerald-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sell Item
                  </Link>
                  <Link
                    href="/my-listings"
                    className="block py-2 text-gray-300 hover:text-emerald-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Listings
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-gray-300 hover:text-emerald-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">EcoFinds</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 EcoFinds. Promoting sustainable consumption.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;