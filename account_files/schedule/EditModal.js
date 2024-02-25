import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, Pressable, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditModal({ modalVisible, setModalVisible, mode, submitForm, initialData }) {
  const [medicine, setMedicine] = useState(initialData ? initialData.medicine : '');
  const [dose, setDose] = useState(initialData ? initialData.dose : '');
  const [timesPerDay, setTimesPerDay] = useState(initialData ? initialData.timesPerDay.toString() : '1');
  const defaultTimesPerDay = 1;
  // initialise doseTimes avoid logic conflict
  const [doseTimes, setDoseTimes] = useState(() => {
    if (initialData && Array.isArray(initialData.doseTimes)) {
      return initialData.doseTimes; // valid initialData
    }
    return Array(defaultTimesPerDay).fill(null);
  });
  const [showPicker, setShowPicker] = useState(false); // use state control DateTimePicker
  const [currentPickerIndex, setCurrentPickerIndex] = useState(null);


  const handleTimesPerDayChange = (value) => {
    const newTimes = parseInt(value, 10);
    setTimesPerDay(value);
    if (!isNaN(newTimes) && newTimes > 0) {
      setDoseTimes(Array(newTimes).fill(null));
    } else if (value === '') {
      setDoseTimes(Array(defaultTimesPerDay).fill(null)); // null input
    }
  };  

  const renderTimePickerButtons = () => {
    // only when doseTimes have a value
    return doseTimes.length > 0 ? doseTimes.map((_, index) => (
      <Button
        key={index}
        title={doseTimes[index] ? doseTimes[index].toLocaleTimeString() : "Select time"}
        onPress={() => {
          setCurrentPickerIndex(index);
          setShowPicker(true);
        }}
      />
    )) : null; // else null no button
  };
  

  const handleTimeChange = (event, selectedTime) => {
    const newDoseTimes = [...doseTimes];
    newDoseTimes[currentPickerIndex] = selectedTime || doseTimes[currentPickerIndex];
    setDoseTimes(newDoseTimes);
    setShowPicker(false);
  };

  // manage form submit
  const handleSubmit = () => {
    // TODO: need to fill with database?
    submitForm({ medicine, timesPerDay, dose });
    setModalVisible(false);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titleText}>{mode === 'add' ? 'Add Schedule' : 'Edit Schedule'}</Text>
            
            <TextInput
              style={styles.input}
              onChangeText={setMedicine}
              value={medicine}
              placeholder="Enter Medicine Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setTimesPerDay}
              value={timesPerDay}
              placeholder="How many times per day"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={setDose}
              value={dose}
              placeholder="Enter Dose"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={handleTimesPerDayChange}
              value={timesPerDay}
              placeholder="How many times per day"
              keyboardType="numeric"
            />
            {renderTimePickerButtons()}
            {showPicker && (
              <DateTimePicker
                value={doseTimes[currentPickerIndex] || new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleSubmit}>
              <Text style={styles.textStyle}>{mode === 'add' ? 'Add' : 'Save'}</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  closebutton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  titleText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    // width: '80%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
