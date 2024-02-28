import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, Pressable, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditModal({ modalVisible, setModalVisible, mode, submitForm, initialData }) {
  const [medicine, setMedicine] = useState(initialData ? initialData.medicine : '');
  const [dose, setDose] = useState(initialData ? initialData.dose : '');
  const defaultTimesPerDay = 1;
  // initialise doseTimes avoid logic conflict
  const [doseTimes, setDoseTimes] = useState(() => {
    if (initialData && Array.isArray(initialData.doseTimes)) {
      return initialData.doseTimes;
    }
    return Array(defaultTimesPerDay).fill(null);
  });
  // const [timesPerDay, setTimesPerDay] = useState(initialData ? initialData.timesPerDay.toString() : '1');
  // const [showPickers, setShowPickers] = useState(() => {
  //   // similar to doseTimes
  //   const initialTimes = parseInt(timesPerDay, 10);
  //   return !isNaN(initialTimes) && initialTimes > 0 && initialTimes <= 5
  //     ? Array(initialTimes).fill(false)
  //     : [];
  // });
  const [showPickers, setShowPickers] = useState(() => doseTimes.map(() => false));
  const [startDate, setStartDate] = useState(initialData ? initialData.startDate : new Date());
  const [endDate, setEndDate] = useState(initialData ? initialData.endDate : new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartPress = () => {
    setShowStartDatePicker(true);
  };
  
  const handleEndPress = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };
  
  // logic of end date earlier than start date
  const [showWarning, setShowWarning] = useState(false);
  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    if (currentDate < startDate) {
      setShowWarning(true);
    } else {
      // hide warning and show date
      setShowWarning(false);
      setEndDate(currentDate);
    }
  };
  // for showing data
  const formatDate = (date) => {
    return date.toLocaleDateString();
  };
  
  
  // how many times per day for pills
  const handleTimesPerDayChange = (value) => {
    // empty input or 0 input
    if (value.trim() === '' || value === '0') {
      setDoseTimes([]); // clean array
      return;
    }
  
    const newTimes = parseInt(value, 10);
    if (!isNaN(newTimes) && newTimes >= 1 && newTimes <= 5) {
      const newDoseTimes = Array(newTimes).fill(null).map((_, index) =>
        doseTimes[index] || new Date()
      );
      setDoseTimes(newDoseTimes);
    } else {
      return;
    }
  };

  const showTimePicker = (index) => {
    setShowPickers(showPickers.map((item, idx) => idx === index));
  };

  const handleTimeChange = (index, event, selectedTime) => {
    const updatedDoseTimes = doseTimes.map((item, idx) => 
      idx === index ? selectedTime || item : item // Retain the time or update if selected
    );
    setDoseTimes(updatedDoseTimes);
    setShowPickers(showPickers.map((item, idx) => idx === index ? false : item));
  };

  // the block for each time take pills
  const renderTimePickerControls = () => {
    return doseTimes.map((time, index) => (
      <View key={index}>
        <Button
          title={time ? time.toLocaleTimeString() : "Select time"}
          onPress={() => showTimePicker(index)}
        />
        {showPickers[index] && (
          <DateTimePicker
            value={time || new Date()} // If time is null then use current time
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => handleTimeChange(index, event, selectedTime)}
          />
        )}
      </View>
    ));
  };
  
  // manage form submit
  const handleSubmit = () => {
    submitForm({ medicine, timesPerDay: doseTimes.length, dose, doseTimes, startDate, endDate });
    setModalVisible(false);
  };
  

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
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
              onChangeText={handleTimesPerDayChange}
              value={doseTimes.length > 0 ? doseTimes.length.toString() : ''}
              placeholder="How many times per day"
              keyboardType="numeric"
              maxLength={1}
            />

            <TextInput
              style={styles.input}
              onChangeText={setDose}
              value={dose}
              placeholder="Enter Dose"
              keyboardType="numeric"
            />
            {renderTimePickerControls()}

            <View>
              <Button style={styles.button} onPress={handleStartPress} title="Select Start Date" />
              {showStartDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}
              <Text>Start Date: {formatDate(startDate)}</Text>
            </View>

            <View>
              <Button style={styles.button} onPress={handleEndPress} title="Select End Date" />
              {showEndDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              )}
              <Text>End Date: {formatDate(endDate)}</Text>
            </View>
            {/* warning of the end date */}
            {showWarning && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  End date must be later than start date. Please choose a different end date.
                </Text>
              </View>
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'black', 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  warningContainer: {
    backgroundColor: '#FFCCCC',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  warningText: {
    color: '#CC0000',
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc', 
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#E8DEF8', 
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonClose: {
    backgroundColor: '#E8DEF8',
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  warningContainer: {
    backgroundColor: '#FFCCCC',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  warningText: {
    color: '#CC0000',
    textAlign: 'center',
  },
});
