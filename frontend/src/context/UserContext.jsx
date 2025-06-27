import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth } from '../api/api';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const validateSession = async () => {
    try {
      const savedUserData = localStorage.getItem('userData');
      const savedLoginStatus = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (savedUserData && savedLoginStatus === 'true' && token) {
        await checkAuth(); 
        
        setUserData(JSON.parse(savedUserData));
        setIsLoggedIn(true);
      } else {
        clearAllStorageData();
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      clearAllStorageData();
    }
  };

  validateSession();
}, []);

  const clearAllStorageData = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    setUserData(null);
    setIsLoggedIn(false);
  };

  const setLoggedIn = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status.toString());

    if (!status) {
      clearAllStorageData();
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

  const setRememberMe = (remember, loginData = null) => {
    if (remember && loginData) {
      localStorage.setItem('rememberedEmail', loginData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const getRememberedEmail = () => {
    return localStorage.getItem('rememberedEmail') || '';
  };

  const logout = () => {
    console.log('Logging out - clearing all data');
    clearAllStorageData();
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