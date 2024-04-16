import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import AddModal from './AddSchedule';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PlusButton({items, setItems, setShouldRefreshAgenda}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Pressable
        style={styles.roundButton}
        onPress={() => setModalVisible(true)}>
        {/* <Text style={styles.textStyle}>+</Text> */}
        <Ionicons name="bag-add" size={24} style={styles.icon}/>
      </Pressable>

      <AddModal modalVisible={modalVisible} setModalVisible={setModalVisible} 
      items={items} setItems={setItems} setShouldRefreshAgenda={setShouldRefreshAgenda}/>
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
    borderColor: '#f7fbfe', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 40, 
    bottom: 40, 
    left: 140, 
    height: 40, 
    borderRadius: 100, 
    backgroundColor: '#f7fbfe',
  },
  icon: {
    color: '#13296c', // Adjust the icon color
    // position: 'absolute',
    // marginTop: 10
  },
  textStyle: {
    color: '#2f3e6e',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  }
});