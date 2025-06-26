import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');

    if (savedUserData && savedLoginStatus === 'true') {
      try {
        setUserData(JSON.parse(savedUserData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);

  const setLoggedIn = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status.toString());

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
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
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
