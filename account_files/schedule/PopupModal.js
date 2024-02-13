import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

export default function PopupModal({ onPress }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Pressable
        style={styles.roundButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>+</Text>
      </Pressable>

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
            <Text style={styles.titleText}>New Schedule</Text>
            <Text style={styles.modalText}>Medicine: </Text>
            <Text style={styles.modalText}>How many times per day: </Text>
            <Text style={styles.modalText}>Dose: </Text>
            <Text style={styles.modalText}>Dose: </Text>
            <Pressable
              style={styles.closebutton}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text>close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // alignItems: 'center',
    elevation: 5,
  },
  closebutton: {
    marginTop: 16,
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    // width: 30, 
    // height: 30, 
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
  },
  titleText: {
    marginBottom: 15,
    textAlign: 'left',
    // fontWeight: 'bold',
    fontSize: 18
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
  }
});