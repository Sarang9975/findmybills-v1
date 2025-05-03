import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, LogOut, Menu, X, Home, Shield, CreditCard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { useTheme } from './ThemeProvider';
import LogoImage from '@/components/ui/assets/FMB-Logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useSession();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // If not on homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Use a small timeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Get the current button label and navigation target based on path and auth status
  const getButtonConfig = () => {
    if (isAuthenticated) {
      return { label: 'Logout', action: handleLogout, icon: <LogOut className="h-4 w-4 mr-1" /> };
    } else {
      if (location.pathname === '/signup') {
        return { label: 'Signup', action: () => navigate('/signup'), icon: null };
      } else if (location.pathname === '/') {
        return { label: 'Login', action: () => navigate('/login'), icon: null };
      } else {
        return { label: 'Login', action: () => navigate('/login'), icon: null };
      }
    }
  };
  
  const buttonConfig = getButtonConfig();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 group cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
          >
            <div className="flex items-center">
              <img 
                src={LogoImage} 
                alt="FindMyBill Logo" 
                className="h-10 w-auto object-contain dark:brightness-125 dark:contrast-125" 
              />
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('who-is-it-for')}
              className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
            >
              Who is it For
            </button>
            <button
              onClick={() => scrollToSection('privacy')}
              className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <ThemeToggle />
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-6 py-2 flex items-center space-x-1"
              onClick={buttonConfig.action}
            >
              {buttonConfig.icon}
              <span>{buttonConfig.label}</span>
              {!isAuthenticated && !buttonConfig.icon && <span className="ml-1">→</span>}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/')
                    ? 'text-primary bg-primary/10 dark:bg-primary/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Home size={18} />
                  <span>Home</span>
                </div>
              </Link>
              <button
                onClick={() => scrollToSection('privacy')}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white"
              >
                <div className="flex items-center space-x-2">
                  <Shield size={18} />
                  <span>Privacy</span>
                </div>
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white"
              >
                <div className="flex items-center space-x-2">
                  <CreditCard size={18} />
                  <span>Pricing</span>
                </div>
              </button>
              {isAuthenticated && (
                <Link
                  to="/invoices"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/invoices')
                      ? 'text-primary bg-primary/10 dark:bg-primary/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FileText size={18} />
                    <span>Invoices</span>
                  </div>
                </Link>
              )}
              {isAuthenticated ? (
                <div 
                  className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </div>
                </div>
              ) : (
                <Link
                  to={location.pathname === '/signup' ? '/signup' : '/login'}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <LogOut size={18} />
                    <span>{location.pathname === '/signup' ? 'Signup' : 'Login'}</span>
                  </div>
                </Link>
              )}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 