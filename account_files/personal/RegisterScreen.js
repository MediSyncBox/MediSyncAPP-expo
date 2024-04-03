import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

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
    <ScrollView contentContainerStyle={styles.container}>
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
      <Button title="Register" onPress={registerUser} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
  },
  linkButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default RegistrationScreen;
