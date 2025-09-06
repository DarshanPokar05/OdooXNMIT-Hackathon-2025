import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';{ useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  User,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Leaf className="h-8 w-8 text-emerald-500" />
            </motion.div>
            <span className="text-2xl font-bold text-white">EcoFinds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-emerald-500 transition-colors">
              Marketplace
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-emerald-500 transition-colors">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-emerald-500 transition-colors">
              How it Works
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 bg-background text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/cart" className="relative text-gray-300 hover:text-emerald-500 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-emerald-500 transition-colors"
                  >
                    <User className="h-6 w-6" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-card shadow-lg py-1"
                    >
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-card-hover">
                        Dashboard
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-card-hover">
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-card-hover flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-300 hover:text-emerald-500 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
