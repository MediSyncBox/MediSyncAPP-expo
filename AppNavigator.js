// AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen'; 
import ProfileEdit from './account_files/personal/profileEdit';
import LoginRegisterScreen from './account_files/personal/LoginRegister';
import PersonalScreen from './account_files/personal/PersonalScreen'; 

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="LoginRegisterScreen" component={LoginRegisterScreen} />
      <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
