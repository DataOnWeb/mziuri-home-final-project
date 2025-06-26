import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');

    if (savedUserData && savedLoginStatus === 'true') {
      try {
        setUserData(JSON.parse(savedUserData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear corrupted data
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);

  const setLoggedIn = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status.toString());

    // If logging out, clear localStorage
    if (!status) {
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedIn');
      setUserData(null);
    }
  };

  const setUserDataPersistent = (data) => {
    setUserData(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      localStorage.removeItem('userData');
    }
  };

  // Optional: Add remember me functionality
  const setRememberMe = (remember, loginData = null) => {
    if (remember && loginData) {
      localStorage.setItem('rememberedEmail', loginData.email);
      // Don't store password for security reasons
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const getRememberedEmail = () => {
    return localStorage.getItem('rememberedEmail') || '';
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    // Keep remembered email if user had "remember me" checked
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        userData,
        setLoggedIn,
        setUserData: setUserDataPersistent,
        setRememberMe,
        getRememberedEmail,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};
