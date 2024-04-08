import React, { useState, useEffect } from 'react';
import { Button, FlatList, ScrollView, Modal, TextInput, View, TouchableOpacity, StyleSheet, Switch, Dimensions } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { useAuth } from '../AuthContext';

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

  // const fetchBoxData = (boxId) => {
  //   const boxData = getBoxData(boxId);
  //   setTemperature(boxData.temperature);
  //   setHumidity(boxData.humidity);
  // };

  // const handleSelectBox = (option) => {
  //   setSelectedOption(option);
  //   fetchBoxData(option.id);
  // };

  // const fetchBoxDetails = (boxName) => {
  //   const { boxInfo } = useAuth();
  //   const envCondition = JSON.parse(boxInfo.env_condition);

  //   const boxDetails = {
  //     temperature: '25',
  //     humidity: '50',
  //   };

  //   setTemperature(envCondition.temperature);
  //   setHumidity(envCondition.humidity);
  // };

  const fetchBoxDetails = async (boxId) => {
    try {
      const response = await fetch(`https://medisyncconnection.azurewebsites.net/api/getTankInfo/${boxId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tank details');
      }
      const details = await response.json();
      updateTankDetails(boxId, details);
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
      // setErrorMessage(error.toString());
    }
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

      <FlatList
        data={boxes}
        horizontal
        keyExtractor={(box) => box.box_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.option, selectedOption === item.box_id && styles.selectedOption]}
            onPress={() => {
              setSelectedOption(item.box_id);
              fetchBoxDetails(item.box_id); // 从后端获取盒子详情
            }}
          >
            <Text style={styles.optionText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />


      {/* 显示所选 box 的 tank 信息 */}
      {selectedOption && tankDetails[selectedOption] && (
        <View style={styles.tankDetailsContainer}>
          {Object.entries(tankDetails[selectedOption]).map(([tankId, tankData]) => (
            <View key={tankId} style={styles.tankDetail}>
              <Text style={styles.detailLabel}>Tank ID: {tankId}</Text>
              <Text style={styles.detailLabel}>Temperature:</Text>
              <Text style={styles.detailValue}>{tankData.temperature}°C</Text>
              <Text style={styles.detailLabel}>Humidity:</Text>
              <Text style={styles.detailValue}>{tankData.humidity}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* 选中盒子的详细信息
      {selectedOption && tanksDetails.map((tank, index) => (
        <View key={index} style={styles.tankDetail}>
          <Text style={styles.text}>Tank {index + 1}:</Text>
          <Text style={styles.text}>Temperature: {tank.temperature}°C</Text>
          <Text style={styles.text}>Humidity: {tank.humidity}%</Text>
        </View>
      ))} */}


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
  },
  tankDetailsContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8DEF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    width: '100%',
  },
  detailLabel: {
    fontSize: 16,
    color: '#000',
    padding: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    padding: 5,
  },
});

export default HomeScreen;
