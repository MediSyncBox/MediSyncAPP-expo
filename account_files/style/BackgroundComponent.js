import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Circle, Stop } from 'react-native-svg';

const BackgroundComponent = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#c6dcee', '#ffffff', '#ffffff', '#c6dcee']}
        // colors={['#c6dcee', '#ffffff']}
        locations={[0, 0.5, 0.5, 1]}
        style={styles.background}
      >
        <Svg height="100%" width="100%" style={styles.svg}>
          <Defs>
            <RadialGradient id="grad1" cx="35%" cy="25%" r="35%">
              <Stop offset="0%" stopColor="white" stopOpacity="1" />
              <Stop offset="1" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="grad4" cx="70%" cy="75%" r="35%">
              <Stop offset="0%" stopColor="white" stopOpacity="1" />
              <Stop offset="1" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="35%" cy="25%" r="40%" fill="url(#grad1)" />
          <Circle cx="75%" cy="79%" r="40%" fill="url(#grad4)" />
        </Svg>
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BackgroundComponent;