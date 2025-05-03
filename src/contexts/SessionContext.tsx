import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SessionContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  resetSessionTimer: () => void;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const TOKEN_KEY = 'token';
const SESSION_EXPIRY_KEY = 'sessionExpiry';

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check initial authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      
      if (token && sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry);
        const currentTime = new Date().getTime();
        
        if (currentTime < expiryTime) {
          setIsAuthenticated(true);
          // Reset the session timer to extend the session
          resetSessionTimer();
        } else {
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Set up session timeout checker
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);
      if (sessionExpiry && new Date().getTime() >= parseInt(sessionExpiry)) {
        handleLogout();
        toast.error('Session expired. Please login again.');
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem('mobileNumber');
    setIsAuthenticated(false);
    try {
      navigate('/login');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/login';
    }
  };

  const resetSessionTimer = () => {
    if (isAuthenticated) {
      const newExpiry = new Date().getTime() + SESSION_TIMEOUT;
      localStorage.setItem(SESSION_EXPIRY_KEY, newExpiry.toString());
    }
  };

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetSessionTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  const handleLogin = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const expiry = new Date().getTime() + SESSION_TIMEOUT;
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
    setIsAuthenticated(true);
  };

  return (
    <SessionContext.Provider 
      value={{
        isAuthenticated,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        resetSessionTimer
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}; 