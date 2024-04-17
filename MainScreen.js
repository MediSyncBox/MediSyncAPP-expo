import * as React from 'react';
import { BottomNavigation,DefaultTheme, Provider as PaperProvider  } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './account_files/AuthContext';
import PersonalScreen from './account_files/personal/PersonalScreen';
import ScheduleScreen from './account_files/schedule/ScheduleScreen';
import HomeScreen from './account_files/home/home';
import Ionicons from '@expo/vector-icons/Ionicons';
import BackgroundComponent from './account_files/style/BackgroundComponent';
import * as Notifications from 'expo-notifications';
// import BackgroundComponent from './account_files/style/BackgroundComponent';


// Create a custom theme by overriding the DefaultTheme colors
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3c80c4', // Your chosen color for the active tab
    accent: '#DDEAF6', // Your chosen color for the active tab background or indicator
    // Add other color overrides if necessary
  },
  // If needed, override additional theme properties here
};


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

  const renderIcon = ({ route, focused }) => (
    // <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
      <Ionicons
        name={focused ? route.icon : `${route.icon}-outline`}
        size={24}
        color={focused ? 'white' : "#3c80c4"}
      />
    // </View>
  );

  return (
    <PaperProvider theme={theme}> 
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={(newIndex) => {
          setIndex(newIndex);
        }}
        renderScene={renderScene}
        renderIcon={renderIcon}
        // activeColor="#ffffff" // Text and icon color for active tab
        // inactiveColor="#3c80c4" // Text and icon color for inactive tab
        // barStyle={{ backgroundColor: '#694fad' }} // Background color of the bottom bar
        activeIndicatorStyle={{ backgroundColor: '#407bb6' }}
        // theme={theme}
        // barStyle={{ backgroundColor: '#13296c'}}
        // activeColor="white"
        // inactiveColor="#3c80c4" 
        barStyle={{ backgroundColor: '#ffffff'}}
        activeColor="#3c80c4"
        inactiveColor="#3c80c4" 
        
        // sceneColor="red"
      />
    </SafeAreaProvider>
    </PaperProvider>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00A499',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  iconWrapperFocused: {
    backgroundColor: '#DDEAF6', // Set the background color for the selected tab icon
    borderRadius: 20, // Optional: Adjust borderRadius for rounded corners
  },
});