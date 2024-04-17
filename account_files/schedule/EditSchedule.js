import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TextInput, View, Switch, Pressable, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure this is installed
import {loadItemsApi} from '../api/schedule';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function EditSchedule({ modalVisible, setModalVisible, initialData, setShouldRefreshAgenda, userId, items, setItems }) {
  const [medicine, setMedicine] = useState(initialData ? initialData.name : '');
  const [dose, setDose] = useState(initialData ? initialData.dose.toString() : '');
  const [taken, setTaken] = useState(initialData ? initialData.taken : false);
  const [time, setTime] = useState(initialData && initialData.time ? new Date(initialData.time) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeButtonText, setTimeButtonText] = useState('Select Time');

  useEffect(() => {
    if (initialData) {
      setMedicine(initialData.name);
      setDose(initialData.dose.toString());
      setTaken(initialData.taken);
      if (initialData.time) {
        const initTime = new Date(initialData.time);
        setTime(initTime);
        setTimeButtonText(initTime.toLocaleTimeString());  // 设置初始按钮文本
      }
    }
  }, [initialData]);
  

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false); // 关闭时间选择器
    if (selectedTime) {
      setTime(selectedTime);
      setTimeButtonText(selectedTime.toLocaleTimeString()); // 更新按钮文本为选择的时间
    }
  };
  

  const handleDeleteSchedule = async () => {
    try {
      // 假设 initialData 有一个 id 属性，用来唯一标识 schedule
      const scheduleId = initialData.id;
      const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/singleDelete/${scheduleId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        Alert.alert("Delete Successful", "The schedule has been deleted.");
        await loadItemsApi([userId], items, setItems);
        setModalVisible(false); // 关闭 modal
        setShouldRefreshAgenda(true); // 刷新 agenda 视图
      } else {
        // 如果响应状态不是 ok，说明删除失败
        Alert.alert("Delete Failed", "The schedule could not be deleted. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Delete Error", "An error occurred while deleting the schedule.");
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
            <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="calendar" size={20} color="#3c80c4"/>
              <Text style={styles.textStyle}>{timeButtonText}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonAdd]}
                onPress={updateSchedule}>
                <Text style={styles.textSave}>Save</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonDelete]}
                onPress={handleDeleteSchedule}>
                <Text style={styles.textDelete}>Delete</Text>
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
  textSave: {
    color: '#81cd48',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textDelete: {
    color: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonAdd: {
    // right: 20,
    borderColor: '#81cd48',
    borderRadius: 25,
    borderWidth: 2,
  },
  buttonDelete: {
    // right: 20,
    borderColor: 'orange',
    borderRadius: 25,
    borderWidth: 2,
  },
  buttonOpen: {
    backgroundColor: '#E8DEF8',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
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
  buttonTaken: {
    backgroundColor: 'green',
  },
  buttonNotTaken: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: '#2d6399',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonClose: {
    // backgroundColor: '#bbb0c7',
    borderRadius: 25,
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
    color: '#3c80c4'
  },
});