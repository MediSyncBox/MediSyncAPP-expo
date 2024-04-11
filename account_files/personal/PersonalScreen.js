// PersonalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import ProfileEdit from './profileEdit';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
const PersonalScreen = () => {
    const { userInfo } = useAuth();
    const navigation = useNavigation();
    console.log('userInfo'); 
    console.log(userInfo); 
    return (
        <View style={styles.container}>
            {/* <List.Section style={styles.selection}>
                {boxes.map((box, index) => (
                    <List.Item
                        key={index}
                        title={box.patient_id} 
                        right={() => <List.Icon icon="chevron-right" />}
                        onPress={() => console.log('Box selected', box)}
                    />
                ))}
            </List.Section> */}
            <TouchableOpacity
                style={styles.header}
                onPress={() => navigation.navigate('ProfileEdit')}
                activeOpacity={1} >
                <Avatar.Image
                    size={80}
                    source={require('../img/account-box-plus-outline.png')}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userInfo?.userName}</Text>
                </View>
                <Ionicons name="pencil-outline" size={24} color="black" />
            </TouchableOpacity>
            <List.Section style={styles.selection}>
                <List.Item
                    title="My Medical Record"
                    right={() => <Ionicons name="chevron-forward-outline" size={24} color="black" />}
                    onPress={() => console.log('Edit profile')}
                />
                <List.Item
                    title="xxx"
                    right={() => <Ionicons name="chevron-forward-outline" size={24} color="black" />}
                    onPress={() => console.log('Edit profile')}
                />
                <List.Item
                    title="Settings"
                    right={() => <Ionicons name="chevron-forward-outline" size={24} color="black" />}
                    onPress={() => console.log('Edit profile')}
                />
            </List.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
