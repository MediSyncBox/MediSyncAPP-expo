import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const DeleteModal = ({ closeModal, items, setItems, currentPatient, setShouldRefreshAgenda}) => {
  const [selectedPatient, setSelectedPatient] = useState(currentPatient.length === 1 ? currentPatient[0].id : '');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';
  const [medicines, setMedicines] = useState([]);

  const handleDelete = async () => {
    // 伪代码：替换为你的API调用逻辑
    // await deleteMedicineAPI(selectedMedicine);
    console.log('Deleting medicine with ID:', selectedMedicine);
    setShouldRefreshAgenda(true); // 刷新Agenda视图
    closeModal(); // 关闭模态框
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
      console.warn(medi)
      if (medi.length > 0) {
        setSelectedMedicine(medi[0]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };
  
  // console.warn(items)

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {currentPatient.length > 1 && (
          <Picker
            selectedValue={selectedPatient}
            onValueChange={(itemValue, itemIndex) => setSelectedPatient(itemValue)}
            style={styles.picker}>
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
