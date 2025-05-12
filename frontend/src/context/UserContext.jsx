import { createContext, useState, useContext } from 'react';

const UserContext = createContext({
  userData: null,
  setUserData: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
});

export const useUserData = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
