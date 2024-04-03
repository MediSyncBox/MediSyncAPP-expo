import React, { useState, useCallback } from 'react';
import AgendaScreen from './AgendaScreen';
import { useAuth } from '../AuthContext';

const ScheduleScreen = () => {
  const { userInfo } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [agendaKey, setAgendaKey] = useState('initialKey');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAgendaKey(prevKey => prevKey + '1');
    setRefreshing(false);
  }, []);

  return <AgendaScreen key={agendaKey} user_id={userInfo?.id} refreshing={refreshing} onRefresh={onRefresh} />;
};

export default ScheduleScreen;