import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import PersonalScreen from './PersonalScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import MainScreen from '../../MainScreen';

const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('https://medisyncconnection.azurewebsites.net/api/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        // Throws an error if the response status code is not 200 OK
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

const RegisterScreen = () => {
    const { login } = useAuth();
    const navigation = useNavigation();
    const [emailorPhone, setEmailorPhone] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
      if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return;
      }
  
      try {
          const response = await fetch('https://medisyncconnection.azurewebsites.net/api/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify({
                  emailorPhone: emailorPhone,
                  userName: userName,
                  password: password,
              }),
          });
  
          // Check for non-OK status before attempting to parse JSON
          // JSON.parse(JSON.stringify(yourJSONobject));
          if (!response.ok) {
              const errorText = await response.text(); // Use text() first to avoid JSON parse error
              // const errorText = await response.json();
              try {
                  const errorData = JSON.parse(errorText); // Attempt to parse it as JSON
                  // throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                  console.error('Registration Failed:', errorData.message);
              } catch (parseError) {
                  // If JSON parsing fails, throw error with the text response
                  // throw new Error(errorText || `HTTP error! Status: ${response.status}`);
                  console.error('Registration Failed:', `Error parsing server response: ${errorText}`);
              }
          }
  
          const data = await response.json(); // If response is OK, then parse JSON
          const token = data.token; // Assuming this comes from the response
          const userInfo = await fetchUserInfo(token);
          login(userInfo);
          navigation.navigate('MainScreen');
      } catch (error) {
          console.error('Registration Failed:', error.message);
          Alert.alert('Registration Failed', error.message);
      }
  };
  
  

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email or Phone"
                value={emailorPhone}
                onChangeText={setEmailorPhone}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={userName}
                onChangeText={setUserName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
});

export default RegisterScreen;
