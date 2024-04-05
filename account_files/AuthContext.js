import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  const login = async (userData, token) => {
    setIsLoggedIn(true);
    setUserInfo(userData); 
    await loadPatientInfo(token);
    console.log(userData);
  };

  const fetchPatientInfo = useCallback(async (caregiverId) => {
    try {
      const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/getPatient/${caregiverId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPatientInfo(data); // Assume the data is an array of patient info
    } catch (error) {
      console.error('Error fetching patient info:', error);
      // Optionally set some error state here
    }
  }, []);

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, patientInfo, fetchPatientInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
