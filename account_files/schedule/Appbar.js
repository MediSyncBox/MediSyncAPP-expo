import React, { useState, useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useAuth } from '../AuthContext'; // 根据实际情况调整导入路径

const CustomAppbar = ({setShouldRefreshAgenda}) => {
  const { userInfo, patientInfo, currentPatient, setCurrentPatient } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
  }, [userInfo]);
  // console.warn(currentPatient)

  const handleSetCurrentPatient = (patient) => {
    setCurrentPatient(patient);
    setIsMenuVisible(false);
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
