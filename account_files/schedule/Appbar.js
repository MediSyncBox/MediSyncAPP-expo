import React, { useState, useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext'; // 根据实际情况调整导入路径
import {loadItemsApi} from '../api/schedule';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CustomAppbar = ({setShouldRefreshAgenda, items, setItems}) => {
  const { userInfo, patientInfo, currentPatient, setCurrentPatient } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // useEffect(() => {
  // }, [userInfo]);
  // console.warn(currentPatient)
  // useEffect(() => {
  //   if (currentPatient) {
  //     const user_ids = Array.isArray(currentPatient) ? currentPatient.map(p => p.id) : [currentPatient.id];
  //     loadItemsApi(user_ids, items, setItems);
  //   }
  //   setShouldRefreshAgenda(true);
  // }, [loadItemsApi, currentPatient]);

  const handleSetCurrentPatient = async (patient) => {
    setCurrentPatient(patient);
    // setItems({});
    // const user_ids = Array.isArray(currentPatient) ? currentPatient.map(p => p.id) : [currentPatient.id];
    // await loadItemsApi(user_ids, items, setItems);
    // console.warn(patient);
    setIsMenuVisible(false);
    // await loadItemsApi(patient, items, setItems);
    setShouldRefreshAgenda(true);
  };

  return (
    <Appbar.Header style={styles.appbar}>
      <Appbar.Content titleStyle={styles.title}
        title={currentPatient ? 
        (Array.isArray(currentPatient) ? "All Patients" : currentPatient.userName) : "Select a Patient"} />
      <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
        <Ionicons name="list" size={24} style={styles.icon}/>
      </TouchableOpacity>
      <Menu
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={<Appbar.Action 
          color="white" 
          onPress={() => setIsMenuVisible(true)} 
          />}
      >
        <Menu.Item
          key="all-patients"
          title="All Patients"
          onPress={() => handleSetCurrentPatient(patientInfo)}
          style={{ minWidth: 150, borderRadius: 20}} // Background color of the menu item
          titleStyle={{ color: '#3c80c4', alignItems: 'center', marginLeft: 12, fontWeight: 'bold'}}
        />
        {patientInfo && patientInfo.map((patient) => (
          <Menu.Item
            key={patient.id}
            title={patient.userName}
            onPress={() => handleSetCurrentPatient(patient)}
            style={{ minWidth: 150, borderRadius: 20}} // Background color of the menu item
            titleStyle={{ color: '#3c80c4', alignItems: 'center', marginLeft: 12, fontWeight: 'bold'}}
          />
        ))}
      </Menu>
    </Appbar.Header>
  );
};

const styles = {
  appbar: {
    height: 45, // Adjust the height to make the Appbar thin
    backgroundColor: 'white',
  },
  title: {
    color: '#3c80c4', // Adjust the text color
    fontSize: 21, // Adjust the text size
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'absolute',
  },
  icon: {
    color: '#3c80c4', // Adjust the icon color
    // position: 'absolute',
    marginTop: 10
  },
};


export default CustomAppbar;