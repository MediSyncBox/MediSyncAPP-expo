import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

// 定义 registerForPushNotificationsAsync 函数
export async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // 读取 projectId
  const projectId = Constants.expoConfig.extra.eas.projectId;

  // 传递 projectId 到 getExpoPushTokenAsync
  token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log(token); 
  return token;
}

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function register() {
      const token = await registerForPushNotificationsAsync();
      setToken(token);
    }

    register();
  }, []);

  return (
    <NotificationContext.Provider value={{ token }}>
      {children}
    </NotificationContext.Provider>
  );
};
