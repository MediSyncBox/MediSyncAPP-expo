
// const fetchPatientInfo = async (caregiverId, setPatientInfo) => {
//   try {
//     const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/getPatient/${caregiverId}`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     setPatientInfo(data);
//   } catch (error) {
//     console.error('Error fetching patient info:', error);
//     Alert.alert('Error', 'Failed to fetch patient information.');
//   }
// };
import React, { useCallback } from "react";

const fetchPatientInfo = async (caregiverId, setPatientInfo) => {
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
};

export { fetchPatientInfo };
