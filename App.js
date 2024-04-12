// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import { AuthProvider } from './account_files/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { NotificationProvider, registerForPushNotificationsAsync } from './account_files/NotificationContext';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const App = () => {
  React.useEffect(() => {
    async function setupNotifications() {
      const token = await registerForPushNotificationsAsync();
      console.log(`Token: ${token}`); 
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification Received: ", notification);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log("Notification Clicked: ", response);
      });

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true, 
          shouldPlaySound: true, 
          shouldSetBadge: false,
        }),
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }

    setupNotifications();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <NotificationProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </NotificationProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
