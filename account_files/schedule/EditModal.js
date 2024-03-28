import React, { useState } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Text, TextInput, Pressable, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../AuthContext';

export default function EditModal({ modalVisible, setModalVisible, mode, submitForm, initialData }) {
  const [medicine, setMedicine] = useState(initialData ? initialData.medicine : '');
  const [dose, setDose] = useState(initialData ? initialData.dose : '');
  const defaultTimesPerDay = 1;
  const { userInfo } = useAuth();
  // initialise doseTimes avoid logic conflict
  const [doseTimes, setDoseTimes] = useState(() => {
    if (initialData && Array.isArray(initialData.doseTimes)) {
      return initialData.doseTimes;
    }
    return Array(defaultTimesPerDay).fill(null);
  });
  
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
        <TouchableOpacity style={styles.button} onPress={() => showTimePicker(index)}>
          <Text style={styles.textStyle}>{time ? time.toLocaleTimeString() : "Select time"}</Text>
        </TouchableOpacity>

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
    // submitForm({ medicine, timesPerDay: doseTimes.length, dose, doseTimes, startDate, endDate });
    const scheduleEntries = [];
    const userId = userInfo?.id;
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
      doseTimes.forEach(time => {
        // Here you extract the hours and minutes from each doseTime and set them on the current day
        const entryTime = new Date(day);
        entryTime.setHours(time.getHours());
        entryTime.setMinutes(time.getMinutes());
  
        // Add the schedule entry for this day and time
        scheduleEntries.push({
          userId: userId, // Replace with the actual userId
          medicine: medicine,
          dose: dose,
          time: entryTime,
          taken: 0 // Assuming the default is not taken (false is represented as 0 in bit field)
        });
      });
    }

    scheduleEntries.forEach(entry => {
      submitSchedule(entry); // Assume submitSchedule is the function to POST the data to the server
    });

    setModalVisible(false);
  };

  const submitSchedule = async (scheduleEntry) => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/addEditSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the 'Authorization' header if the request needs to be authenticated
        },
        body: JSON.stringify(scheduleEntry),
      });
  
      // For debugging: log the response status and response text
      console.log('Response status:', response.status);
      const text = await response.text(); // Read the text from the response
      console.log('Response body:', text);
  
      if (response.ok) {
        // Attempt to parse the text as JSON
        try {
          const json = JSON.parse(text);
          console.log('Schedule submitted:', json);
          // Handle the parsed JSON as needed
        } catch (e) {
          throw new Error('Response was not valid JSON.');
        }
      } else {
        throw new Error('Server responded with a status: ' + response.status);
      }
    } catch (error) {
      console.error('Error submitting schedule:', error);
      // Handle the error appropriately in the UI
    }
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
              <TouchableOpacity style={styles.button} onPress={handleStartPress}>
                <Text style={styles.textStyle}>Select Start Date</Text>
              </TouchableOpacity>

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
              <TouchableOpacity style={styles.button} onPress={handleEndPress}>
                <Text style={styles.textStyle}>Select End Date</Text>
              </TouchableOpacity>
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

            <View style={styles.buttonContainer}>
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
    backgroundColor: '#bbb0c7',
    borderRadius: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin:10,
    marginTop: 10,
    justifyContent: 'space-between',
    width: '50%', 
    alignSelf: 'center',
  },
});

