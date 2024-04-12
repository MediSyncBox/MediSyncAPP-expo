import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import DeleteModal from './DeleteModal';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DeleteButton({items, setItems, currentPatient, setShouldRefreshAgenda}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Ionicons name="trash-bin" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <DeleteModal closeModal={() => setModalVisible(false)} items={items} setItems={setItems} 
        currentPatient={currentPatient} setShouldRefreshAgenda={setShouldRefreshAgenda}/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom: 10,
    // left: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: 40,
    // bottom: 40,
    backgroundColor: 'red',
    borderRadius: 25,
    // left: 40, 
    // height: 40, 
    width: 40, 
    bottom: 40, 
    right: 140, 
    height: 40, 
  },
});
