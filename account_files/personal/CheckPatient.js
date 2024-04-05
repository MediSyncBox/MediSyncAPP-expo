import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext'; // Import useAuth from your AuthContext file path

const CheckPatient = () => {
  const navigation = useNavigation();
  // const { patientInfo } = useAuth(); // Access patientInfo from context
  // const [patients, setPatients] = useState([]); // Local state for patients
  const { fetchPatientInfo, patientInfo } = useAuth();
  const { userInfo } = useAuth();
  const caregiverId = userInfo?.id;

  // console.warn(patientInfo)

  useEffect(() => {
    fetchPatientInfo(caregiverId);
  }, [fetchPatientInfo, caregiverId]);
  console.warn(patientInfo)

  return (
    <View>
      {patientInfo ? (
        patientInfo.map((patient) => (
          <Text key={patient.id}>{patient.userName}</Text> // Replace 'user_id' with the actual key from your patient data
        ))
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default CheckPatient;
