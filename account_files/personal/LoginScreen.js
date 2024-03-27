import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import PersonalScreen from './PersonalScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const LoginScreen = () => {
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
          // Proceed with your logic after successful login
          navigation.navigate('MainScreen'); 
        } else {
          throw new Error('Expected JSON response, but received a different format');
        }
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
    <ScrollView contentContainerStyle={styles.container}>
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
      <Button title="Login" onPress={loginUser} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
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

export default LoginScreen;