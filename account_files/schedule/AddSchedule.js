import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Text, TextInput, Pressable, View, Button, Alert} from 'react-native';
import { Menu, Portal } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../AuthContext';
import {loadItemsApi} from '../api/schedule';
import { Picker } from '@react-native-picker/picker'; // 或者从 react-native 中导入
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AddModal({ modalVisible, setModalVisible, items, setItems, setShouldRefreshAgenda }) {
  const [medicine, setMedicine] = useState(undefined);
  const [dose, setDose] = useState(undefined);
  const defaultTimesPerDay = 1;
  const { userInfo, patientInfo } = useAuth();
  // initialise doseTimes avoid logic conflict
  const [doseTimes, setDoseTimes] = useState(() => {
    return Array(defaultTimesPerDay).fill(null);
  });

  const [showPickers, setShowPickers] = useState(() => doseTimes.map(() => false));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = userInfo?.id;
  const [selectedPatientId, setSelectedPatientId] = useState(userId);
  const [startDateText, setStartDateText] = useState("Select Start Date");
  const [endDateText, setEndDateText] = useState("Select End Date");

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    // 如果patientInfo只有一个，则自动选择该patient
    if (patientInfo && patientInfo.length === 1) {
      setSelectedPatientId(patientInfo[0].id);
    }
  }, [patientInfo]);

  const renderPatientPicker = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedPatientId}
        onValueChange={(itemValue, itemIndex) => setSelectedPatientId(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Choose User" value="" />
        {patientInfo.map((patient) => (
          <Picker.Item key={patient.id} label={patient.userName} value={patient.id} />
        ))}
      </Picker>
    </View>
  );

  useEffect(() => {
    setShowPickers(doseTimes.map(() => false));
  }, [doseTimes.length]);  

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
    setStartDateText(currentDate.toLocaleDateString());  // 更新按钮文本
  };

  // logic of end date earlier than start date
  const [showWarning, setShowWarning] = useState(false);
  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    if (currentDate < startDate) {
      setShowWarning(true);
      setEndDateText("Select End Date");  // 保持原始文本如果日期选择不合适
    } else {
      setShowWarning(false);
      setEndDate(currentDate);
      setEndDateText(currentDate.toLocaleDateString());  // 更新按钮文本
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
    setShowPickers(showPickers.map((item, idx) => idx === index ? !item : item));
  };

  const handleTimeChange = (index, event, selectedTime) => {
    const updatedDoseTimes = doseTimes.map((item, idx) =>
      idx === index ? selectedTime || item : item // Retain the time or update if selected
    );
    setDoseTimes(updatedDoseTimes);
    // This will hide the picker after a time is selected
    setShowPickers(showPickers.map((item, idx) => idx === index ? false : item));
  };
  // the block for each time take pills
  const renderTimePickerControls = () => {
    return doseTimes.map((time, index) => (
      <View key={index}>
        <TouchableOpacity style={styles.button} onPress={() => showTimePicker(index)}>
          <Ionicons name="time" size={20} color="#3c80c4"/>
          <Text style={styles.timeTextStyle}>{time ? time.toLocaleTimeString() : "Select time"}</Text>
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

  // useEffect(() => {
  //   if (userId) {
  //     loadItemsApi(userId, items, setItems);
  //   }
  // }, [loadItemsApi, userId]);

  
  // manage form submit
  const handleSubmit = async () => {
    setIsLoading(true); 
    const scheduleEntries = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
      doseTimes.forEach(time => {
        // Here you extract the hours and minutes from each doseTime and set them on the current day
        if (!time) {
          Alert.alert('No time selected', 'Please select a time before adding the schedule.');
          return;
        }
        const entryTime = new Date(day);
        entryTime.setHours(time.getHours());
        entryTime.setMinutes(time.getMinutes());
  
        // Add the schedule entry for this day and time
        scheduleEntries.push({
          userId: patientInfo.length <= 1 ? userId : selectedPatientId,
          medicine: medicine,
          dose: dose,
          time: entryTime,
          taken: 0 // Assuming the default is not taken (false is represented as 0 in bit field)
        });
      });
    }

    try {
      for (let entry of scheduleEntries) {
        await submitSchedule(entry);
      }
    } catch (error) {
      console.error('Failed to submit or refresh schedules:', error);
    }
    setShouldRefreshAgenda(true);
    setIsLoading(false);
    setModalVisible(false);
  };

  const submitSchedule = async (scheduleEntry) => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/addEditSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleEntry),
      });
  
      console.log('Response status:', response.status);
      const text = await response.json(); // Read the text from the response
  
      if (!response.ok) throw new Error('Failed to submit schedule');
      // return text;
      await loadItemsApi([userId], items, setItems);
    } catch (error) {
      console.error('Error submitting schedule:', error);
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
            <Text style={styles.titleText}>{'Add Schedule'}</Text>
            {patientInfo && patientInfo.length > 1 && renderPatientPicker()}

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
            {/* {renderDateInputs()} */}

            <View>
            <TouchableOpacity style={styles.button} onPress={handleStartPress}>
              <Ionicons name="calendar" size={20} color="#3c80c4"/>
              <Text style={styles.dateTextStyle}>{startDateText}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            </View>

            <View>
            <TouchableOpacity style={styles.button} onPress={handleEndPress}>
              <Ionicons name="calendar" size={20} color="#3c80c4"/>
              <Text style={styles.dateTextStyle}>{endDateText}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
            </View>
            {/* warning of the end date */}
            {showWarning && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  End date must be later than start date. Please choose a different end date.
                </Text>
              </View>
            )}
            {isLoading && (
              <View style={styles.warningContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
                {/* Or use a Spinner/ActivityIndicator component here */}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonAdd]}
                onPress={handleSubmit}>
                <Text style={styles.textStyle}>{' Add '}</Text>
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
  pickerContainer: {
    // backgroundColor: 'red'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3c80c4'
  },
  picker: {
    height: 50,
    width: 200,
    borderRadius: 25,
    // backgroundColor: '#f0f0f0',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#f4f9fd',
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
  dateTextStyle: {
    left: 3,
    color: '#3c80c4',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeTextStyle: {
    left: 3,
    color: '#3c80c4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 5,
    width: '95%',
    // borderWidth: 1,
    // borderColor: 'black',
    padding: 10,
    // borderRadius: 5,
    borderBottomColor: '#3c80c4', // Color of the separator line
    borderBottomWidth: 1,
  },
  // loadingContainer: {
  //   position: 'absolute',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
  button: {
    backgroundColor: '#f4f9fd',
    borderColor: '#3c80c4',
    borderRadius: 25,
    borderWidth: 2,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    flexDirection: 'row',
  },
  buttonAdd: {
    right: 50,
    borderColor: '#2d6399',
    borderRadius: 25,
    borderWidth: 2,
  },
  buttonClose: {
    left: 50,
    borderColor: '#2d6399',
    borderRadius: 25,
    borderWidth: 2,
    right: 50,
  },
  warningContainer: {
    // backgroundColor: '#FFCCCC',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  warningText: {
    color: '#CC0000',
    textAlign: 'center',
  },
  loadingText: {
    color: '#3c80c4',
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

