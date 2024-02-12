import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function CircleButton({ onPress }) {
  const buttonClickedHandler = () => {
    alert('You pressed a button.')
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        onPress={buttonClickedHandler}
        style={styles.roundButton1}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton1: {
    borderWidth: 1, 
    borderColor: '#43515c', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 40, 
    bottom: 40, 
    left: 140, 
    height: 40, 
    borderRadius: 100, 
    backgroundColor: '#43515c',
  },
});
