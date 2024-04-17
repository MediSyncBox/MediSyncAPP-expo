import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert, Image } from 'react-native';
// import PersonalScreen from './PersonalScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { fetchPatientInfo } from '../api/patient';
import BackgroundComponent from '../style/BackgroundComponent';
import Ionicons from '@expo/vector-icons/Ionicons';

const LoginScreen = () => {
  const { login, setPatientInfo } = useAuth();
  const [emailorPhone, setEmailorPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const loginUser = async () => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailorPhone,
          password,
        }),
      });

      // Check if the response header indicates JSON content
      const contentType = response.headers.get('content-type');
      if (response.ok) {

        if (contentType && contentType.includes('application/json')) {
          const json = await response.json(); // Safely parse the JSON
          const userInfo = await fetchUserInfo(json.token);
          Alert.alert('Login Success', `Welcome, ${userInfo.userName}`);
          login(userInfo);
          // Proceed with your logic after successful login
          navigation.navigate('MainScreen');
        } else {
          throw new Error('Expected JSON response, but received a different format');
        }
        // await fetchPatientInfo(userInfo.id, setPatientInfo);
      } else {
        // Handle non-200 responses
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          Alert.alert('Login Failed', json.error || 'An error occurred');
        } else {
          throw new Error('Received non-JSON response from server');
        }
      }
    } catch (error) {
      console.error('Failed to login user:', error.message);
      // Here, you might want to display a generic error message to the user
      Alert.alert('Login Error', 'Please check your username or password.');
    }
  };


  // Define the fetchUserInfo function within the LoginScreen component or import it if it's defined externally
  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <BackgroundComponent>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../img/logo.png')}
          style={styles.logo}
        />
        {/* <Text style={styles.title}>Login</Text> */}
        {/* <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          onChangeText={setEmailorPhone}
          value={emailorPhone}
        /> */}
        <View style={styles.firstInputContainer}>
          <Ionicons name="mail-outline" size={20} color="#3c80c4" />
          <TextInput
            style={styles.input}
            placeholder="Email or Phone"
            onChangeText={setEmailorPhone}
            value={emailorPhone}
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
        <TouchableOpacity style={styles.firstButton} onPress={loginUser}>
          <View flexDirection='row'>
              <Ionicons name="log-in" size={20} color="#3c80c4"/>
            <Text style={styles.buttonText}>LOGIN</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  firstInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3c80c4',
    padding: 10,
    marginTop: 180,
    width: 310
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#3c80c4',
    padding: 10,
    marginTop: 5,
    width: 310
  },
  logo: {
    position: 'absolute',
    top: 10,
    // alignSelf: 'center',
    width: 200,
    // height: 200,
    aspectRatio: 1,
    resizeMode: 'contain',
    // marginTop: 10,
    // marginBottom: 40,
  },
  // input: {
  //   width: '100%',
  //   height: 50,
  //   top: 100,
  //   backgroundColor: '#ffffff',
  //   // borderWidth: 1,
  //   // borderColor: '#70bdf5',
  //   // borderRadius: 5,
  //   paddingHorizontal: 10,
  //   // marginBottom: 10,
  //   marginBottom: 10,
  //   color: '#1a2771',
  //   width: 300,
  //   // borderRadius: 25,
  //   paddingHorizontal: 16, 
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
    top: 25,
    // marginLeft: 10,
    // borderRadius: 25,
    // borderColor: '#3d80cb',
    // borderBlockColor: '#3d80cb',
    // borderWidth: 2,
  },
  firstButton: {
    width: '40%',
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    // alignItems: 'left',
    // borderRadius: 5,
    // marginTop: 30,
    marginLeft: 50,
    top: 30, 
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

export default LoginScreen;