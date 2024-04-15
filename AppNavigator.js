// AppNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
// import ProfileEdit from './account_files/personal/profileEdit';
import Login from './account_files/personal/LoginScreen';
import PersonalScreen from './account_files/personal/PersonalScreen';
import { useAuth } from './account_files/AuthContext'; // Adjust the path as necessary
import RegisterScreen from './account_files/personal/RegisterScreen';
import CheckPatient from './account_files/personal/CheckPatient';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn } = useAuth(); // Use the authentication status to conditionally set the initial route

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? "MainScreen" : "Login"}>
      {/* <Stack.Navigator> */}
      <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CheckPatient" component={CheckPatient} options={{
        headerStyle: {
          backgroundColor: '#DDEAF6', // Different color for another screen
        },
      }} />
      <Stack.Screen name="Login" component={Login} options={{
        headerStyle: {
          backgroundColor: '#DDEAF6', // Different color for another screen
        },
      }} />
      <Stack.Screen name="PersonalScreen" component={PersonalScreen} options={{
        headerStyle: {
          backgroundColor: '#DDEAF6', // Different color for another screen
        },
      }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{
        headerStyle: {
          backgroundColor: '#DDEAF6', // Different color for another screen
        },
      }} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
