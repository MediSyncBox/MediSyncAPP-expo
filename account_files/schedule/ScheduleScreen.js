import React, { useState, useCallback } from 'react';
import AgendaScreen from './AgendaScreen';
import { useAuth } from '../AuthContext';

const ScheduleScreen = () => {
  const { userInfo } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Here, you should trigger any necessary data fetching or state updates
    // that the AgendaScreen needs to refresh its content.
    // After the data fetching is done, set refreshing to false.
    setTimeout(() => { // Simulating a network request
      setRefreshing(false);
    }, 1500);
  }, []);

  // Pass the refreshing and onRefresh props to the AgendaScreen.
  // You will need to modify the AgendaScreen component to accept these props
  // and pass them appropriately to the Agenda component it renders.
  return <AgendaScreen user_id={userInfo?.id} refreshing={refreshing} onRefresh={onRefresh} />;
};

export default ScheduleScreen;
