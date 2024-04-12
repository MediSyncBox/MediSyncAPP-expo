// // App.js
// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AppNavigator from './AppNavigator';
// import { AuthProvider } from './account_files/AuthContext';

// const App = () => {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     </AuthProvider>

//   );
// };

// export default App;
// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import { AuthProvider } from './account_files/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    // PaperProvider 包裹其他所有提供者和导航组件
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
