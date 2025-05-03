import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import LogoImage from '@/components/ui/assets/FMB-Logo.png';

const SharedNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, logout } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isLandingPage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';

  // Get button configuration based on authentication and current path
  const getButtonConfig = () => {
    if (isAuthenticated) {
      return { 
        label: 'Logout', 
        action: handleLogout, 
        icon: <LogOut size={16} />
      };
    } else {
      if (isSignupPage) {
        return { 
          label: 'Signup', 
          action: () => navigate('/signup'), 
          icon: <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        };
      } else {
        return { 
          label: 'Login', 
          action: () => navigate('/login'), 
          icon: <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        };
      }
    }
  };

  const buttonConfig = getButtonConfig();

  // Don't render navigation items while loading
  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-lg shadow-sm py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="container-main">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
            >
              <div className="flex items-center">
                <img 
                  src={LogoImage} 
                  alt="FindMyBill Logo" 
                  className="h-10 w-auto object-contain scale-125 dark:brightness-125 dark:contrast-125" 
                />
              </div>
            </motion.div>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage
          ? 'bg-white dark:bg-gray-900 backdrop-blur-lg shadow-sm py-3 border-b border-gray-200 dark:border-gray-800' 
          : 'bg-white/90 dark:bg-gray-900/90 py-5 border-b border-transparent'
      }`}
    >
      <div className="container-main">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
          >
            <div className="flex items-center">
              <img 
                src={LogoImage} 
                alt="FindMyBill Logo" 
                className="h-10 w-auto object-contain scale-125 dark:brightness-125 dark:contrast-125" 
              />
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              isLandingPage ? (
                <>
                  {['How it Works', 'Who is it For', 'Privacy', 'Pricing'].map((item) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-800 dark:text-white hover:text-primary font-medium relative group"
                      whileHover={{ y: -2 }}
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  ))}
                  <ThemeToggle />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={buttonConfig.action}
                      className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span>{buttonConfig.label}</span>
                      {buttonConfig.icon}
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={buttonConfig.action}
                      className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span>{buttonConfig.label}</span>
                      {buttonConfig.icon}
                    </Button>
                  </motion.div>
                </>
              )
            ) : (
              <>
                <Link
                  to="/invoices"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/invoices')
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-800 dark:text-white hover:text-primary'
                  }`}
                >
                  Invoices
                </Link>
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-800 dark:text-white hover:text-primary"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <motion.button 
              className="text-gray-800 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg absolute top-full left-0 right-0 border-t border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
            >
              <div className="flex flex-col py-4">
                {!isAuthenticated ? (
                  isLandingPage ? (
                    <>
                      {['How it Works', 'Who is it For', 'Privacy', 'Pricing'].map((item) => (
                        <motion.a
                          key={item}
                          href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="px-6 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group"
                          onClick={() => setMobileMenuOpen(false)}
                          whileHover={{ x: 4 }}
                        >
                          <span>{item}</span>
                          <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </motion.a>
                      ))}
                      <div className="px-6 py-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            onClick={() => {
                              setMobileMenuOpen(false);
                              navigate(isSignupPage ? '/signup' : '/login');
                            }}
                            className="bg-primary hover:bg-primary/90 text-white w-full rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                          >
                            <span>{isSignupPage ? 'Signup' : 'Login'}</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <div className="px-6 py-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate(isSignupPage ? '/signup' : '/login');
                          }}
                          className="bg-primary hover:bg-primary/90 text-white w-full rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                        >
                          <span>{isSignupPage ? 'Signup' : 'Login'}</span>
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </div>
                  )
                ) : (
                  <>
                    <Link
                      to="/invoices"
                      className={`px-6 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group ${
                        isActive('/invoices') ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Invoices</span>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-6 py-3 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group"
                    >
                      <span>Logout</span>
                      <LogOut size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default SharedNav; 