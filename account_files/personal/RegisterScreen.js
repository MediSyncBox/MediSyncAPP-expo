import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import BackgroundComponent from '../style/BackgroundComponent';
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
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          onChangeText={setEmailorPhone}
          value={emailorPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUserName}
          value={userName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>Register</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a2771', // Title color matched
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#70bdf5', // Input border color matched
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#1a2771' // Input text color matched
  },
  button: {
    width: '40%', // Size adjustment for aesthetics
    height: 50,
    backgroundColor: '#3d80cb', // Button color matched
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20, // Increased margin for separation
  },
  buttonText: {
    color: '#ffffff', // Button text color for readability
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
