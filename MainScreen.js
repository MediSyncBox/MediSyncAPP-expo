import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './account_files/AuthContext';
import PersonalScreen from './account_files/personal/PersonalScreen';
import ScheduleScreen from './account_files/schedule/ScheduleScreen';
import HomeScreen from './account_files/home/home';
import Ionicons from '@expo/vector-icons/Ionicons';

const MainScreen = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'schedule', title: 'Schedule', icon: 'calendar' },
    { key: 'home', title: 'Home', icon: 'cube' },
    { key: 'personal', title: 'Personal', icon: 'person' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    schedule: ScheduleScreen,
    personal: PersonalScreen,
  });

  const renderIcon = ({ route, focused, color }) => (
    <Ionicons
      name={focused ? route.icon : `${route.icon}-outline`}
      size={24}
      color={color}
    />
  );

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={(newIndex) => {
          setIndex(newIndex);
        }}
        renderScene={renderScene}
        renderIcon={renderIcon}
      />
    </SafeAreaProvider>
  );
};

export default MainScreen;
