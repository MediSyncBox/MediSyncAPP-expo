import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TextInput, View, Switch, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure this is installed
import {loadItemsApi} from '../api/schedule';

export default function EditSchedule({ modalVisible, setModalVisible, initialData, setShouldRefreshAgenda, userId, items, setItems }) {
  const [medicine, setMedicine] = useState(initialData ? initialData.name : '');
  const [dose, setDose] = useState(initialData ? initialData.dose.toString() : '');
  const [taken, setTaken] = useState(initialData ? initialData.taken : false);
  const [time, setTime] = useState(initialData && initialData.time ? new Date(initialData.time) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMedicine(initialData.name);
      setDose(initialData.dose.toString()); // Convert to string for consistency
      setTaken(initialData.taken);
      if (initialData.time) setTime(new Date(initialData.time)); // Set time if available
    }
  }, [initialData]);

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false); // Close the picker
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  
  const updateSchedule = async () => {
    // Prepare the data object from the state before sending it
    const scheduleData = {
      id: initialData.id, // assuming initialData has an `id` property
      medicine: medicine,
      dose: Number(dose),
      taken: taken ? 1 : 0,
      time: time.toISOString(), // Convert the date to an ISO string
    };
    // console.warn(scheduleData)
    // console.warn(initialData)
  
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/updateSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
  
      if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
        const data = await response.json();
        if (data.success) {
          Alert.alert("Update Successful", "The schedule has been updated.");
          await loadItemsApi([userId], items, setItems);
          setModalVisible(false); // Close the modal after successful update
          // reloadData(); // Call the passed callback function to reload data in AgendaScreen
        } else {
          Alert.alert("Update Failed", "The schedule update failed. Please try again.");
        }
        
      } else {
        // If the response is not JSON, log the response to debug
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        Alert.alert("Update Error", "The response from the server was not in JSON format.");
      }
      // if (response.ok) {
      //   // 调用成功，更新日程数据
      //   try {
      //     await loadItemsApi(userId, items, setItems);
      //     // 标记为需要刷新Agenda组件
      //     setShouldRefreshAgenda(true); // 通知父组件刷新Agenda
      //     setModalVisible(false);
      //   } catch (error) {
      //     console.error('Failed to reload items: ', error);
      //   }
      // }
    } catch (error) {
      console.error(error);
      Alert.alert("Update Error", "An error occurred while updating the schedule.");
    }
    setShouldRefreshAgenda(true);
    
};
  

  const resetForm = () => {
    // Reset all local states to their initial values
    if (initialData) {
      setMedicine(initialData.name);
      setDose(initialData.dose.toString());
      setTaken(initialData.taken);
      setTime(initialData.time ? new Date(initialData.time) : new Date());
    } else {
      // Reset to default values if there's no initialData
      setMedicine('');
      setDose('');
      setTaken(false);
      setTime(new Date());
    }
  };
  

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titleText}>Edit Schedule</Text>

            <TextInput
              style={styles.input}
              onChangeText={setMedicine}
              value={medicine}
              placeholder="Enter Medicine Name"
            />

            <TextInput
              style={styles.input}
              onChangeText={setDose}
              value={dose}
              placeholder="Enter Dose"
              keyboardType="numeric"
            />

            <Pressable
              style={styles.buttonOpen}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.textStyle}>Select Time</Text>
            </Pressable>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <Text>Time: {time.toLocaleTimeString()}</Text>

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Taken: </Text>
              <Text>{taken ? 'Yes' : 'No'}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#E8DEF8" }}
                thumbColor={taken ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setTaken}
                value={taken}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={updateSchedule}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  // Simply hide the modal without saving the changes
                  setModalVisible(false);
                  // Reset local component state to initialData if needed
                  resetForm();
                }}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Updated styles to include switchContainer and switchLabel
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
  input: {
    height: 40,
    margin: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonOpen: {
    backgroundColor: '#E8DEF8',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonClose: {
    backgroundColor: '#bbb0c7',
    borderRadius: 20,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  // Rest of the styles remain unchanged
  buttonOpen: {
    backgroundColor: '#E8DEF8', // Or any other visible color to differentiate from the save/close buttons
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
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
  buttonTaken: {
    backgroundColor: 'green',
  },
  buttonNotTaken: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonClose: {
    backgroundColor: '#bbb0c7',
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    marginTop: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});