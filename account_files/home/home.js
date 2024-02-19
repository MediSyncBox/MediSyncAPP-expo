import React, { useState } from 'react';
import { Button, ScrollView, Modal, TextInput, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Appbar } from 'react-native-paper';

const HomeScreen = () => {

  const options = ['BOX1', 'BOX2', 'BOX3', 'BOX4', 'BOX5'];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const [visible, setVisible] = useState(false);
  const [boxId, setBoxId] = useState('');
  const [name, setName] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);


  return (

    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Your Medical Boxes" />
        <Appbar.Action icon="plus-box-outline" onPress={showModal} />
      </Appbar.Header>

      <Modal
        visible={visible}
        onRequestClose={hideModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <View style={styles.inputGroup}>
              <Text style={styles.textLabel}>BOX ID:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Box ID"
                value={boxId}
                onChangeText={setBoxId}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.textLabel}>Name:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  console.log('Submitted:', { boxId, name });
                  hideModal(); 
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>




      <View style={styles.scroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, selectedOption === option && styles.selectedOption]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.information}>
        <Text variant="headlineSmall" style={styles.headline}>Temperature</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>20°C</Text>
        </View>
        <Text variant="headlineSmall" style={styles.headline}>Humidity</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>20rh</Text>
        </View>
        <Text variant="headlineSmall" style={styles.headline}>Pills</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Paracetamol</Text>
        </View>



      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5
  },
  scroll: {
    paddingTop: 10
  },
  option: {
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: '#E8DEF8',
  },
  optionText: {
    color: 'black',
  },
  textContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E8DEF8',
    backgroundColor: '#E8DEF8',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  information: {
    marginTop: 20,
  },
  headline: {
    marginLeft: 10,
  },
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
    alignItems: 'flex-start',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    lineHeight: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textLabel: {
    flex: 1,
    marginRight: 10,
  },
  textInput: {
    flex: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#E8DEF8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,

  },

  buttonContainer: {
    alignItems: 'center',
    width: '100%', 
    marginTop: 20, 
  },
  


});

export default HomeScreen;
