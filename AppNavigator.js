// AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen'; // 主屏幕，包含底部导航
import ProfileEdit from './account_files/profileEdit'; // 引入其他页面如果需要

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
