import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth } from '../api/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
  const validateSession = async () => {
    try {
      const savedUserData = localStorage.getItem('userData');
      const savedLoginStatus = localStorage.getItem('isLoggedIn');

      await new Promise((res) => setTimeout(res, 300));

      const response = await checkAuth();

      if (response?.data) {
        setIsLoggedIn(true);
        setUserData(response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', 'true');
      } else if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
        setIsLoggedIn(savedLoginStatus === 'true');
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      clearAllStorageData();
    } finally {
      setAuthChecked(true);
    }
  };

  validateSession();
}, []);
  const clearAllStorageData = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
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
        authChecked,
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
