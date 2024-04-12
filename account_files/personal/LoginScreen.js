import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert, Image } from 'react-native';
// import PersonalScreen from './PersonalScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { fetchPatientInfo } from '../api/patient';
import BackgroundComponent from '../style/BackgroundComponent';

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
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          onChangeText={setEmailorPhone}
          value={emailorPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={loginUser}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Go to Register</Text>
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
  },

  logo: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    width: 120,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',

  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a2771',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#70bdf5',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#1a2771'
  },
  button: {
    width: '40%',
    height: 50,
    backgroundColor: '#3d80cb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
  },

});

export default LoginScreen;