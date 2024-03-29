import * as React from 'react';
import AgendaScreen from './AgendaScreen';
import PopupWindow from './PlusButton';
import { useAuth } from '../AuthContext';
// import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const ScheduleScreen = () => {
  const { userInfo } = useAuth();
  return (
    <AgendaScreen user_id={userInfo?.id}/>
  );
};

export default ScheduleScreen;
