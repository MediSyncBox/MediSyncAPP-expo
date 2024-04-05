import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import { useAuth } from '../AuthContext'; // Make sure the path is correct

const CheckPatient = () => {
  const { fetchPatientInfo, patientInfo } = useAuth();
  const { userInfo } = useAuth();
  const caregiverId = userInfo?.id;
  const [isAdding, setIsAdding] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  useEffect(() => {
    if (caregiverId) {
      fetchPatientInfo(caregiverId);
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
      await fetchPatientInfo(caregiverId);
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
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter User ID"
            value={newUserId}
            onChangeText={setNewUserId}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Add Patient" onPress={handleAddPatient} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 30, // Adjust the line height to be the same as the font size to vertically center the plus sign
  },
  inputContainer: {
    padding: 20,
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 1, // Add shadow on Android
    shadowOpacity: 0.1, // Add shadow on iOS
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
  },
  patientName: {
    fontSize: 18,
  },
  listContainer: {
    paddingBottom: 20, // Adds padding to the bottom of the list
  },
});

export default CheckPatient;
