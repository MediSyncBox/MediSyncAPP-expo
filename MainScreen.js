// MainScreen.js
import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PersonalScreen from './PersonalScreen';

const HomeRoute = () => <Text>Music</Text>;
const ScheduleRoute = () => <Text>Recents</Text>;

const MainScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'schedule', title: 'Schedule', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    { key: 'personal', title: 'Personal', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    schedule: ScheduleRoute,
    personal: PersonalScreen,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
};

export default MainScreen;
