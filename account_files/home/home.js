import React, { useState } from 'react';
import { Button, FlatList, ScrollView, Modal, TextInput, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { useAuth } from '../AuthContext';

const HomeScreen = () => {
  const { userInfo } = useAuth();
  const userId = userInfo?.id;
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { setBoxInfo } = useAuth();

  const handleSubmitBox = async () => {
    if (!boxId || !name) {
      setErrorMessage('Please fill in both fields');
      return;
    }

    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/addBox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          boxId,
          name,
        }),
      });
      // const responseText = await response.text();
      // console.log(responseText);

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setOptions(prevOptions => [...prevOptions, name]);
        setBoxInfo(result); 
        fetchBoxDetails(name);
        hideModal();
      } else {
        setErrorMessage(result.message || 'Failed to update box');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during the request');
    }
  };


  const addOption = (newOption) => {
    setOptions(prevOptions => {
      const updatedOptions = [...prevOptions, newOption];
      if (updatedOptions.length === 1) {
        setSelectedOption(newOption);
        fetchBoxDetails(newOption);
      }
      return updatedOptions;
    });
  };

  // const fetchBoxData = (boxId) => {
  //   const boxData = getBoxData(boxId);
  //   setTemperature(boxData.temperature);
  //   setHumidity(boxData.humidity);
  // };

  // const handleSelectBox = (option) => {
  //   setSelectedOption(option);
  //   fetchBoxData(option.id);
  // };

  const fetchBoxDetails = (boxName) => {
    const boxDetails = {
      temperature: '25',
      humidity: '50',
    };

    setTemperature(boxDetails.temperature);
    setHumidity(boxDetails.humidity);
  };


  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [visible, setVisible] = useState(false);
  const [boxId, setBoxId] = useState('');
  const [name, setName] = useState('');
  const [pillName, setpillName] = useState('');
  const [pillNumber, setpillNumber] = useState('');
  const [pillTank, setpillTank] = useState('');
  const [pillvisible, setPillVisible] = useState(false);
  const [pills, setPills] = useState([]);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setBoxId('');
    setName('');
    setErrorMessage('');
  };
  const showPillModal = () => setPillVisible(true);
  const hidePillModal = () => {
    setPillVisible(false);
    setErrorMessage('');
  };


  const addPill = () => {
    if (!pillName || !pillNumber || !pillTank) {
      setErrorMessage('Please fill in all fields');
    } else if (pillTank != 1 && pillTank != 2 && pillTank != 3) {
      setErrorMessage('The tank number must be 1, 2, or 3');
    } else {
      // Add the new pill to the list of pills
      setPills([...pills, { name: pillName, number: pillNumber, tank: pillTank }]);
      // Reset the pill name, number, and tank
      setpillName('');
      setpillNumber('');
      setpillTank('');
      // Hide the modal
      hidePillModal();
    }

  };


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
              <Text style={styles.closeButtonText}>x</Text>
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
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitBox}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <Modal
        visible={pillvisible}
        onRequestClose={hidePillModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={hidePillModal}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
            <View style={styles.inputGroup}>
              <Text style={styles.textLabel}>Name of Pills:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Name"
                value={pillName}
                onChangeText={setpillName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.textLabel}>Number of Pills:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Number"
                value={pillNumber}
                onChangeText={setpillNumber}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.textLabel}>Place of Pills:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter the tank number (1, 2, or 3)"
                value={pillTank}
                onChangeText={setpillTank}
              />
            </View>

            <View style={styles.buttonContainer}>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={addPill}
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


        {selectedOption && temperature && (
          <View>
            <Text variant="headlineSmall" style={styles.headline}>Temperature</Text>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{temperature}</Text>
            </View>
          </View>
        )}


        {selectedOption && humidity && (
          <View>
            <Text variant="headlineSmall" style={styles.headline}>Humidity</Text>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Humidity: {humidity}rh</Text>
            </View>
          </View>
        )}



        <Text variant="headlineSmall" style={styles.headline}>Pills</Text>
        <View style={styles.placeholder}></View>
        <FlatList
          data={pills}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.pillContainer}>
              <Text style={styles.text}>{`${item.name} - ${item.number} - ${item.tank}`}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={showPillModal}>
          <Text style={styles.buttonText}>Add Pills</Text>
        </TouchableOpacity>
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

  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#9575CD',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center', // Center the text inside the button
    borderRadius: 25, // Rounded corners
    alignSelf: 'center',
    width: 100,
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  pillContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E8DEF8',
    backgroundColor: '#E8DEF8',
    borderRadius: 10,
    padding: 10,

    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  placeholder: {
    marginTop: 20,

  }
});

export default HomeScreen;
