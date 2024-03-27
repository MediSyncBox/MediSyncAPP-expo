import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './account_files/AuthContext';
import PersonalScreen from './account_files/personal/PersonalScreen';
import ScheduleScreen from './account_files/schedule/ScheduleScreen';
import HomeScreen from './account_files/home/home';
import LoginRegisterScreen from './account_files/personal/LoginScreen'; 

const MainScreen = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'schedule', title: 'Schedule', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'personal', title: 'Personal', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen />;
      case 'schedule':
        return <ScheduleScreen />;
        case 'personal':
          return <PersonalScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={(newIndex) => {
          // if (routes[newIndex].key === 'personal' && !isLoggedIn) {
          //   navigation.navigate('LoginRegister');
          // }
          setIndex(newIndex);
        }}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
};

export default MainScreen;
