import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import AgendaScreen from './AgendaScreen';
import { useAuth } from '../AuthContext';

const ScheduleScreen = () => {
  const { userInfo } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const [agendaKey, setAgendaKey] = useState('initialKey');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request completed
    setAgendaKey(prevKey => prevKey + '1'); // Change the key to force re-render
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <AgendaScreen key={agendaKey} user_id={userInfo?.id} />
    </ScrollView>
  );
};

export default ScheduleScreen;
