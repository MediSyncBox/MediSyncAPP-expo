import React, { useState, useEffect } from 'react';
import { Button, FlatList, ScrollView, Modal, TextInput, View, TouchableOpacity, StyleSheet, Switch, Dimensions } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { useAuth } from '../AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import BackgroundComponent from '../style/BackgroundComponent';

const HomeScreen = () => {
  const { userInfo, tankDetails, updateTankDetails } = useAuth();
  const userId = userInfo?.id;
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [boxes, setBoxes] = useState([]);
  const [isUserOwnBox, setIsUserOwnBox] = useState(false);

  // const { setBoxInfo } = useAuth();

  useEffect(() => {
    fetchUserBoxes();
  }, []);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedBoxForDeletion, setSelectedBoxForDeletion] = useState(null);

  const showDeleteModal = (boxId) => {
    setSelectedBoxForDeletion(boxId);
    setDeleteVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteVisible(false);
    setSelectedBoxForDeletion(null);
  };

  const deleteBox = async () => {
    if (selectedBoxForDeletion) {
      try {
        const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/deleteBox`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, boxId: selectedBoxForDeletion }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete box');
        }
        hideDeleteModal();
        fetchUserBoxes();
      } catch (error) {
        console.error('Delete error:', error);
        setErrorMessage(error.toString());
      }
    }
  };

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
          isUserOwnBox,
        }),
      });
      // const responseText = await response.text();
      // console.log(responseText);

      const result = await response.json();
      // console.log (result);
      if (response.ok) {
        hideModal();
        fetchUserBoxes();
      } else {
        // setErrorMessage(result.message || 'Failed to update box');
        setErrorMessage(result.message || 'Failed to add box due to server error.');
      }
    } catch (error) {
      // setErrorMessage(error.message || 'An error occurred during the request');
      console.error('Fetch error:', error);
      setErrorMessage(error.toString() || 'An unknown error occurred.');
    }
  };

  const fetchUserBoxes = async () => {
    if (userId) {
      try {
        const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/getUserBox/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch boxes');
        }
        const data = await response.json();
        const detailsPromises = data.map(box => fetchBoxDetails(box.box_id));
        const detailsResults = await Promise.all(detailsPromises);
        detailsResults.forEach((details, index) => {
          if (details) {
            updateTankDetails(data[index].box_id, details);
          }
        });

        setBoxes(data);

      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMessage(error.toString());
      }
    } else {
      setErrorMessage('User ID is undefined');
    }
  };

  const addOption = (newOption) => {
    setOptions(prevOptions => {
      const updatedOptions = [...prevOptions, newOption];
      if (updatedOptions.length === 1) {
        setSelectedOption(newOption);
        // fetchBoxDetails(newOption);
      }
      return updatedOptions;
    });
  };


  const fetchBoxDetails = async (boxId) => {
    try {
      const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/getTankInfo/${boxId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tank details');
      }
      const details = await response.json();
      updateTankDetails(boxId, details);


      details.forEach(tank => {
        if (tank.pillNumber && parseInt(tank.pillNumber) < 5) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Insufficient pill balance",
              body: `You only got ${tank.pillNumber} of ${tank.pillName} left, please add them.`,
            },
            trigger: null,
          });
        }
      });

    } catch (error) {
      console.error('Fetch error:', error);
      // setErrorMessage(error.toString());
      return null;
    }
  };


  const getActualTankId = (boxId, selectedTankIndex) => {
    const tanks = tankDetails[boxId];
    if (!tanks) {
      console.error('No tanks found for this box_id:', boxId);
      return null;
    }

    const sortedTanks = [...tanks].sort((a, b) => a.id - b.id);
    return sortedTanks[selectedTankIndex]?.id;
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



  const addPill = async () => {
    if (!pillName || !pillNumber || selectedOption === '' || pillTank === undefined) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const actualTankId = getActualTankId(selectedOption, parseInt(pillTank));
    if (!actualTankId) {
      setErrorMessage('Invalid tank selected');
      return;
    }

    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/addPills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxId: selectedOption,
          tankId: actualTankId,
          pillName,
          pillNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add pill information');
      }

      // Handle success
      if (pillNumber && parseInt(pillNumber) < 5) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Insufficient pill balance",
            body: `You only got ${pillNumber} of ${pillName} left, please add them.`,
          },
          trigger: null,
        });
      }
      setPills([...pills, { name: pillName, number: pillNumber, tank: pillTank }]);
      setpillName('');
      setpillNumber('');
      setpillTank('');
      hidePillModal();
      // Optional: fetch updated tank details if needed
      // fetchUserBoxes();

    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage(error.toString());
    }
  };

  return (
    <BackgroundComponent>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Your Medical Boxes" titleStyle={styles.title} options={{
            headerStyle: {
              backgroundColor: '#DDEAF6', // Different color for another screen
            },
          }} />
          <TouchableOpacity onPress={showModal} style={{ marginRight: 10 }}>
            <Ionicons name="create-outline" size={30} color="black" />
          </TouchableOpacity>
        </Appbar.Header>

        <FlatList
          data={boxes}
          horizontal
          keyExtractor={(box) => box.box_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.option, selectedOption === item.box_id && styles.selectedOption]}
              onPress={() => {
                setSelectedOption(item.box_id);
                fetchBoxDetails(item.box_id);
              }}
              onLongPress={() => showDeleteModal(item.box_id)}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />


        <ScrollView style={styles.tankDetailsScroll}>
          {selectedOption && tankDetails[selectedOption] && (
            Object.entries(tankDetails[selectedOption]).map(([tankId, tankData]) => (
              <View key={tankId} style={styles.tankCard}>
                <Text style={styles.tankId}>{`Tank ID: ${tankId}`}</Text>
                <View style={styles.tankInfo}>
                  <Text style={styles.temperature}>{`${tankData.temperature}°C`}</Text>
                  <Text style={styles.humidity}>{`${tankData.humidity}%`}</Text>
                </View>
                <View style={styles.pillsInfo}>
                  <Text style={styles.pillName}>{tankData.pillName || 'No pills'}</Text>
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <Text style={styles.quantity}>{tankData.pillNumber || '0'}</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={showPillModal}>
                    <Text style={styles.editButtonText}>{tankData.pillName ? 'Edit' : 'Add'} Pills</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>


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
              <View style={styles.inputGroup}>
                <Text style={styles.textLabel}>Is Your Own Box:</Text>
                <Switch
                  value={isUserOwnBox}
                  onValueChange={setIsUserOwnBox}
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
                  placeholder="Enter tank number (0, 1, or 2)"
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

        <Modal
          visible={deleteVisible}
          onRequestClose={hideDeleteModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Are you sure you want to delete this box?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={deleteBox}
                >
                  <Text style={styles.submitButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={hideDeleteModal}
                >
                  <Text style={styles.submitButtonText}>Cancel</Text>
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


          {/* {selectedOption && temperature && (
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
        </TouchableOpacity> */}
        </View>
      </View >
    </BackgroundComponent>
  );
};

const styles = StyleSheet.create({
  background: {
    zIndex: -1, // Ensures the background is behind all other content
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    zIndex: 1, // Ensures content is above the background
  },
  appbar: {
    height: 60, // Adjust the height to make the Appbar thin
    backgroundColor: 'white',
  },
  title: {
    color: '#3c80c4', // Adjust the text color
    fontSize: 21, // Adjust the text size
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'absolute',
  },
  option: {
    // width: Dimensions.get('window').width * 0.2, // Removed fixed width
    minWidth: 80, // Minimum width to ensure boxes are not too small
    height: 45,
    paddingHorizontal: 20, // Increase horizontal padding to provide space around text
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: '#ADB0C3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  selectedOption: {
    backgroundColor: '#1a2771',
  },
  optionText: {
    color: '#ffffff', // Text color for visibility against the background
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  tankDetailsScroll: {
    // If you have a tab bar or any other components, adjust the height accordingly
    height: '80%', // Or you can use flex: 1 if it doesn't work
  },
  // container: {
  //   paddingTop: 5
  // },
  scroll: {
    paddingTop: 10
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
    marginLeft: 50,
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
    backgroundColor: '#3d80cb', // NHS Blue for primary buttons
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff', // White text for legibility on NHS Blue
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#3d80cb', // A lighter NHS Blue variant for secondary buttons
    padding: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  boxItem: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
  },

  scrollContainer: {

  },
  tankList: {
    paddingVertical: 20,
  },
  tankCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    marginBottom: 0,
    elevation: 3,
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
  },
  tankId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    // marginLeft: 10, 
  },
  tankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: {
    color: '#1E90FF',
    fontSize: 16,
  },
  humidity: {
    color: '#1E90FF',
    fontSize: 16,
  },
  pillsInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    alignItems: 'center', // Center align for the Add Pills button
  },
  pillName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center align for quantity
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  quantity: {
    fontSize: 16,
    color: '#333',
  },

});

export default HomeScreen;
