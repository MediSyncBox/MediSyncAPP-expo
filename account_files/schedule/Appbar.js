import React, { useState, useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useAuth } from '../AuthContext'; // 根据实际情况调整导入路径
import {fetchPatientInfo} from '../api/patient';

const CustomAppbar = () => {
  const { userInfo, patientInfo, currentPatient, setCurrentPatient } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // 当用户信息存在，但患者信息未加载时，尝试加载患者信息
  useEffect(() => {
    // 因为 fetchPatientInfo 已经在 AuthContext 中被调用，这里不需要重复加载
    // 这个 useEffect 可以留空，或者用于其他初始化逻辑
  }, [userInfo]); // 依赖于 userInfo 的变化
  return (
    <Appbar.Header>
      <Appbar.Content title={currentPatient ? currentPatient.name : "Select a Patient"} />
      <Appbar.Action icon="menu" onPress={() => setIsMenuVisible(true)} />
      <Menu
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={<Appbar.Action icon="dots-vertical" color="white" onPress={() => setIsMenuVisible(true)} />}
      >
        {patientInfo && patientInfo.map((patient) => (
          <Menu.Item
            key={patient.id}
            title={patient.userName}
            onPress={() => {
              setCurrentPatient(patient);
              setIsMenuVisible(false);
            }}
          />
        ))}
      </Menu>
    </Appbar.Header>
  );
};

export default CustomAppbar;
