import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import { useAuth } from '../AuthContext'; // Make sure the path is correct
import {fetchPatientInfo} from '../api/patient';
import BackgroundComponent from '../style/BackgroundComponent';
import Ionicons from '@expo/vector-icons/Ionicons';

const CheckPatient = () => {
  const { setPatientInfo, patientInfo, setCurrentPatient } = useAuth();
  const { userInfo } = useAuth();
  const caregiverId = userInfo?.id;
  const [isAdding, setIsAdding] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  useEffect(() => {
    if (caregiverId) {
      fetchPatientInfo(caregiverId, setPatientInfo, setCurrentPatient);
    }
  }, [fetchPatientInfo, caregiverId]);

  const renderPatient = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.patientName}>{item.userName}</Text>
      </View>
    );
  };

  const handleAddPatient = async () => {
    // await checkBox();
    // Validate and make sure the newUserId is not empty and is a number
    if (!newUserId.trim() || isNaN(newUserId)) {
      alert("Please enter a valid User ID");
      return;
    }

    // Call your API to add the new patient, we'll define addPatientToCaregiver next
    try {
      await addPatientToCaregiver(newUserId);
      
      setNewUserId(''); // Reset the input
      setIsAdding(false); // Close the input field
    } catch (error) {
      alert(error.message);
    }
  };

  // const checkBox = async (userId) => {
  //   // baseURL = 'https://medisyncconnection.azurewebsites.net/api/medicine-reminder'
  //   const time = '11:20';
  //   try {
  //     const response = await fetch('https://medisyncconnection.azurewebsites.net/api/medicine-reminder/8', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({time}),
  //     });
      
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const data = await response.json();
  //     console.warn(data)
      
  //   } catch (error) {
  //     console.error('Error fetching patient info:', error);
  //     // Optionally set some error state here
  //   }
  // };

  const addPatientToCaregiver = async (userId) => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/addPatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, caregiverId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add patient');
      }

      // If the new patient was added successfully, refresh the patient list
      await fetchPatientInfo(caregiverId, setPatientInfo, setCurrentPatient);
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };

  return (
      <View style={styles.container}>
        {patientInfo ? (
          <FlatList
            data={patientInfo}
            renderItem={renderPatient}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAdding(true)}
        >
          <Ionicons name="person-add" size={24} style={styles.icon}/>
        </TouchableOpacity>
        {isAdding && (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter User ID"
              value={newUserId}
              onChangeText={setNewUserId}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#888" // Light grey color for the placeholder
            />
            <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
              <Text style={styles.buttonText}>Add Patient</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4fb',
  },
  button: {
    backgroundColor: '#3784bc', // Blue background
    padding: 10,
    borderRadius: 25,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 16,
    fontWeight: 'bold'
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4f9acc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  inputContainer: {
    padding: 20,
    // margin: 20,
    marginBottom: 35,
    marginLeft: 20,
    justifyContent: 'space-between',
    marginRight: 85
  },
  input: {
    paddingHorizontal: 16, 
    height: 40,
    borderColor: '#3784bc',
    borderWidth: 2,
    marginBottom: 20,
    borderRadius: 25,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: '#e1e1e1',
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: '#7d8896', // Light blue background
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 25, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Shadow depth on Android
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 6, // How blurred the shadow should be
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // The offset of shadow
  },
  patientName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },
  listContainer: {
    paddingBottom: 20, // Adds padding to the bottom of the list
  },
  icon: {
    color: 'white',
    // backgroundColor: '#4f9acc'
  }
});

export default CheckPatient;