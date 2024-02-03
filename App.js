import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PersonalScreen from './PersonalScreen';

const HomeRoute = () => <Text>Music</Text>;
const ScheduleRoute = () => <Text>Recents</Text>;


const MyComponent = () => {
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

  const activeTabColor = '#FF844B'; // Orange color for the active tab background
  const activeTextColor = '#FFFFFF'; // White color for the active tab icon and text
  const inactiveTabColor = 'gray'; // Light blue color for the ina

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      //   activeColor={activeTextColor}
      // inactiveColor={inactiveTabColor}
      //barStyle={{ backgroundColor: activeTabColor }} // Set the background color for the active tabF
      />
      
    </SafeAreaProvider>
    
  );
};

export default MyComponent;
