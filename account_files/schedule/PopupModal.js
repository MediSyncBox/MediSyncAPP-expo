import React from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

export default function PopupModal({ modalVisible, setModalVisible }) {
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
            <Text style={styles.titleText}>Schedule</Text>
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