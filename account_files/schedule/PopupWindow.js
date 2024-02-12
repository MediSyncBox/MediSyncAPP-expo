import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

export default function PopupWindow({ onPress }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={styles.closebutton}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text>close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.roundButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    // shadowColor: '#000',
    elevation: 5,
  },
  closebutton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});