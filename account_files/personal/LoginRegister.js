import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import PersonalScreen from './PersonalScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const LoginRegisterScreen  = () => {
    const { login } = useAuth();
    const navigation = useNavigation();
    const [emailorPhone, setEmailorPhone] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://medisyncconnection.azurewebsites.net/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailorPhone: emailorPhone,
                    password: password,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server");
            }
            const data = await response.json();
            if(response.ok) {
                console.log('Login successful:', data);
                login();
                // navigation.navigate('PersonalScreen'); 
            } else {
                throw new Error(data.message || 'An error occurred during login');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error.message);

        }

    };

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
                },
                body: JSON.stringify({
                    emailorPhone: emailorPhone,
                    userName: userName,
                    password: password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // 保存登录 token、导航到个人页面或主页
                console.log('Registration successful:', data);
                navigation.navigate('PersonalScreen'); // 或您的应用中适当的屏幕
            } else {
                throw new Error(data.message || 'An error occurred during registration');
            }
        } catch (error) {
            Alert.alert('Registration Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email or Phone"
                value={emailorPhone}
                onChangeText={setEmailorPhone}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />

            <Text style={styles.title}>Register</Text>
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

export default LoginRegisterScreen;
