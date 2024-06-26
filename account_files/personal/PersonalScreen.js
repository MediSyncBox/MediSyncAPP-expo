// PersonalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import ProfileEdit from './profileEdit';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import BackgroundComponent from '../style/BackgroundComponent';

const PersonalScreen = () => {
    const { userInfo } = useAuth();
    const navigation = useNavigation();
    console.log('userInfo'); 
    console.log(userInfo); 
    return (
        <BackgroundComponent>
            <View style={styles.container}>
                <Avatar.Image
                    size={80}
                    source={require('../img/avatar.png')}
                    style={{ backgroundColor: 'transparent' }}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userInfo?.userName}</Text>
                </View>
            </View>
            <View style={styles.listContainer}>
                <List.Section style={styles.selection}>
                    <List.Item
                        title={'Email/Phone: ' + userInfo?.emailorPhone}
                    />
                    <List.Item
                        title={'ID: ' + userInfo?.id}
                    />
                    <List.Item
                        title="Check patient"
                        onPress={() => navigation.navigate('CheckPatient')}
                    />
                </List.Section>
            </View>   
        </BackgroundComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        marginBottom: 300,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    userInfo: {
        flex: 1,
        marginLeft: 20,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    userId: {
        fontSize: 14,
        color: 'grey',
    },
    selection: {
        paddingLeft: 20,
        paddingRight: 20,
    }

});

export default PersonalScreen;
