import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const DeleteModal = ({ closeModal, items, setItems, currentPatient, setShouldRefreshAgenda}) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';
  const [medicines, setMedicines] = useState([]);

  const handleDelete = async () => {
    if (!selectedPatient) {
      Alert.alert('No patient selected', 'Please select a patient before deleting the schedule.');
      return;
    }
    try {
      const response = await axios.delete(`${baseUrl}/batchDelete/${selectedPatient}/${selectedMedicine}`);
      if (response.status === 200) {
        console.log('Medicine deleted successfully:', selectedMedicine);
        setShouldRefreshAgenda(true); // Refresh Agenda view
        Alert.alert('Success', 'The schedule has been deleted successfully.');
      } else {
        console.log('Failed to delete medicine:', response.data);
        Alert.alert('Deletion Failed', 'Failed to delete the schedule.');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      Alert.alert('Error', 'An error occurred while trying to delete the schedule.');
    }
    closeModal();
  };  

  useEffect(() => {
    if (selectedPatient) {
      fetchMedicinesForUser(selectedPatient);
    }
  }, [selectedPatient]);

  const fetchMedicinesForUser = async (selectedPatient) => {
    try {
      const response = await axios.get(`${baseUrl}/getMedicines/${selectedPatient}`);
      const medi = response.data;
      setMedicines(medi);
      if (medi.length > 0) {
        setSelectedMedicine(medi[0]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };
  

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {currentPatient.length > 1 && (
          <Picker
            selectedValue={selectedPatient}
            onValueChange={(itemValue, itemIndex) => setSelectedPatient(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Who's schedule you want to delete?" value="" />
            {currentPatient.map((patient) => (
              <Picker.Item key={patient.id} label={patient.userName} value={patient.id} />
            ))}
          </Picker>
        )}

        <Picker
          selectedValue={selectedMedicine}
          onValueChange={(itemValue, itemIndex) => setSelectedMedicine(itemValue)}
          style={styles.picker}>
          {medicines.map((medicine) => (
              <Picker.Item key={medicine} label={medicine} value={medicine} />
            ))}
        </Picker>

        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleDelete}>
          <Text style={styles.textStyle}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={closeModal}>
          <Text style={styles.textStyle}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    width: 200,
    height: 44,
    marginBottom: 20,
  },
});

export default DeleteModal;
