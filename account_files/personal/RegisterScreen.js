import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import BackgroundComponent from '../style/BackgroundComponent';
import Ionicons from '@expo/vector-icons/Ionicons';

const RegistrationScreen = () => {
  const { login } = useAuth();
  const [emailorPhone, setEmailorPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const registerUser = async () => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailorPhone,
          userName,
          password,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        // For non-OK responses, attempt to read as JSON for detailed error messages
        if (contentType && contentType.includes('application/json')) {
          const errorJson = await response.json();
          Alert.alert('Registration Failed', errorJson.message || 'An error occurred');
        } else {
          // Non-JSON responses or lack of details can use a generic error
          throw new Error('Registration failed due to a server error.');
        }
      } else {
        // For successful responses, handle both JSON and non-JSON content types
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          login(json);
          // Assuming JSON response includes a token; adjust based on actual API behavior
          const userInfo = await fetchUserInfo(json.token);
          Alert.alert('Registration Success', `Welcome, ${userInfo.userName}!`);
          navigation.navigate('MainScreen');
        } else {
          // Handle successful response without JSON content gracefully
          // If you expect a token or specific data in JSON format, adjust this logic accordingly
          Alert.alert('Registration Success', 'You have been registered successfully.');
          navigation.navigate('Login'); // Navigate to login or another appropriate screen
        }
      }
    } catch (error) {
      console.error('Registration error:', error.message);
      Alert.alert('Registration Error', error.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <BackgroundComponent>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../img/logo.png')}
          style={styles.logo}
        />
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#3c80c4" />
          <TextInput
            style={styles.input}
            placeholder="Email or Phone"
            onChangeText={setEmailorPhone}
            value={emailorPhone}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#3c80c4" />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUserName}
            value={userName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={20} color="#3c80c4" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>
        
        {/* <TouchableOpacity style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button} onPress={registerUser}>
          <View flexDirection='row'>
            <Ionicons name="log-out" size={20} color="#3c80c4"/>
            <Text style={styles.buttonText}>REGISTER</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </BackgroundComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, 
    backgroundColor: 'white'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3c80c4',
    padding: 10,
    marginTop: 5,
    width: 310,
    top: 55
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a2771', // Title color matched
  },
  // logo: {
  //   position: 'absolute',
  //   top: 100,
  //   alignSelf: 'center',
  //   width: 120,
  //   height: undefined,
  //   aspectRatio: 1,
  //   resizeMode: 'contain',

  // },
  logo: {
    position: 'absolute',
    top: 10,
    // alignSelf: 'center',
    width: 200,
    // height: 200,
    aspectRatio: 1,
    resizeMode: 'contain',
    // marginTop: 10,
    // bottom: 800,
  },
  // input: {
  //   width: '100%',
  //   height: 50,
  //   backgroundColor: '#ffffff',
  //   borderWidth: 1,
  //   borderColor: '#70bdf5', // Input border color matched
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   marginBottom: 10,
  //   color: '#1a2771' // Input text color matched
  // },
  input: {
    flex: 1,
    marginLeft: 10,
    // fontWeight: 'bold',
    color: '#3c80c4',
    // fontColor: '#3c80c4',
  },
  button: {
    width: '40%',
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 5,
    // marginTop: 30,
    top: 85,
    // marginLeft: 10,
    // borderRadius: 25,
    // borderColor: '#3d80cb',
    // borderBlockColor: '#3d80cb',
    // borderWidth: 2,
  },
  buttonText: {
    color: '#3d80cb',
    fontSize: 15,
    fontWeight: 'bold',
    left: 5
  },
});

export default RegistrationScreen;
