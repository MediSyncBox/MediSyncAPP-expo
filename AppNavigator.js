// AppNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen'; 
import ProfileEdit from './account_files/personal/profileEdit';
import LoginRegisterScreen from './account_files/personal/LoginScreen';
import PersonalScreen from './account_files/personal/PersonalScreen'; 
import { useAuth } from './account_files/AuthContext'; // Adjust the path as necessary
import RegisterScreen from './account_files/personal/RegisterScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn } = useAuth(); // Use the authentication status to conditionally set the initial route

  return (
    <Stack.Navigator initialRouteName={isLoggedIn() ? "MainScreen" : "LoginRegisterScreen"}>
      <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="LoginRegisterScreen" component={LoginRegisterScreen} />
      {/* <Stack.Screen name="PersonalScreen" component={PersonalScreen} /> */}
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
