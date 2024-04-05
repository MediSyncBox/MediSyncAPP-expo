// In AuthContext.js or similar
// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Placeholder for your login logic
//   const login = (credentials) => {
//     // Perform login
//     // If successful, set the user state
//     setUser({ /* user data */ });
//   };

//   // Placeholder for your logout logic
//   const logout = () => {
//     // Perform logout
//     setUser(null);
//   };

//   const isLoggedIn = () => user !== null;

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [boxInfo, setBoxInfo] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUserInfo(userData); 
    console.log(userData);
  };
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout, boxInfo,setBoxInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
