import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import PopupModal from './PopupModal';

export default function PlusButton() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Pressable
        style={styles.roundButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>+</Text>
      </Pressable>

      <PopupModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
    borderWidth: 1, 
    borderColor: '#43515c', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 40, 
    bottom: 40, 
    left: 140, 
    height: 40, 
    borderRadius: 100, 
    backgroundColor: '#000',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});