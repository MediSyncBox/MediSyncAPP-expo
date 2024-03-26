import React from 'react';
import { Modal, StyleSheet, Text, View, Pressable } from 'react-native';
import EditModal from './EditModal';

export default function DisplayModal({ modalVisible, setModalVisible, initialData, setEditModalVisible}) {

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const handleEditPress = () => {
    setModalVisible(false);
    setEditModalVisible(true);
  };
  

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titleText}>{initialData ? 'Schedule Details' : 'No Details Available'}</Text>
            
            {initialData && (
              <View>
                <Text style={styles.detailsText}>Medicine: {initialData.medicine}</Text>
                <Text style={styles.detailsText}>Dose: {initialData.dose}</Text>
                <Text style={styles.detailsText}>Times per day: {initialData.doseTimes.length}</Text>
                <Text style={styles.detailsText}>Start Date: {formatDate(initialData.startDate)}</Text>
                <Text style={styles.detailsText}>End Date: {formatDate(initialData.endDate)}</Text>
              </View>
            )}

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleEditPress}>
              <Text style={styles.textStyle}>Edit</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  detailsText: {
    fontSize: 16,
    margin: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    backgroundColor: '#E8DEF8',
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
});

