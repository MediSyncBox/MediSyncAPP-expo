import React, { useState, useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useAuth } from '../AuthContext'; // 根据实际情况调整导入路径
import {loadItemsApi} from '../api/schedule';

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
    <Appbar.Header>
      <Appbar.Content title={currentPatient ? (Array.isArray(currentPatient) ? "All Patients" : currentPatient.userName) : "Select a Patient"} />
      <Appbar.Action icon="menu" onPress={() => setIsMenuVisible(true)} />
      <Menu
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={<Appbar.Action icon="dots-vertical" color="white" onPress={() => setIsMenuVisible(true)} />}
      >
        <Menu.Item
          key="all-patients"
          title="All"
          onPress={() => handleSetCurrentPatient(patientInfo)}
        />
        {patientInfo && patientInfo.map((patient) => (
          <Menu.Item
            key={patient.id}
            title={patient.userName}
            onPress={() => handleSetCurrentPatient(patient)}
          />
        ))}
      </Menu>
    </Appbar.Header>
  );
};

export default CustomAppbar;
