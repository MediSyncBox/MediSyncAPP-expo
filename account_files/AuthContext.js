import React, { createContext, useState, useContext, useCallback , useEffect} from 'react';
import {fetchPatientInfo} from './api/patient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);

  const login = async (userData, token) => {
    setIsLoggedIn(true);
    setUserInfo(userData); 
    console.log(userData);
    // await fetchPatientInfo(userData.id, setPatientInfo);
    try {
      // const patientInfo = await fetchPatientInfo(userData.id);
      // setPatientInfo(patientInfo);
      await fetchPatientInfo(userData.id, setPatientInfo, setCurrentPatient);
      // setCurrentPatient(patientInfo);
    } catch (error) {
        console.error("Failed to fetch patient info:", error);
    }
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, patientInfo, setPatientInfo, 
    currentPatient, setCurrentPatient, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
