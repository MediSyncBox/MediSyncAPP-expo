// PersonalScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { useAuth } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import BackgroundComponent from '../style/BackgroundComponent';
import Ionicons from '@expo/vector-icons/Ionicons';

const PersonalScreen = () => {
    const { userInfo } = useAuth();
    const navigation = useNavigation();

    // Ensure userInfo has all necessary properties or provide defaults
    const userName = userInfo?.userName || 'Your Name';
    const email = userInfo?.emailorPhone || 'your.email@example.com';
    const userId = userInfo?.id || 'Your ID';

    

    return (
        <BackgroundComponent>
            <View style={styles.container}>
                <Avatar.Image
                    size={100}
                    source={require('../img/avatar.png')}
                    style={styles.avatar}
                />
                <Text style={styles.userName}>{userName}</Text>
            </View>
            <View style={styles.listContainer}>
                <List.Section>
                    <List.Item
                        style={styles.listItem}
                        title={`Email: ${email}`}
                        // description={email}
                        left={() => <Ionicons name="mail-outline" size={24} color="#36536b" />}
                        titleStyle={styles.listTitle}
                        descriptionStyle={styles.listDescription}
                    />
                    <List.Item
                        title={`ID: ${userId}`}
                        // description={userId}
                        style={styles.listItem}
                        left={() => <Ionicons name="lock-closed" size={24} color="#36536b" />}
                        titleStyle={styles.listTitle}
                        descriptionStyle={styles.listDescription}
                    />
                    <List.Item
                        title="Check patient"
                        style={styles.listItem}
                        left={() => <Ionicons name="person" size={24} color="#36536b" />}
                        onPress={() => navigation.navigate('CheckPatient')}
                        right={() => <Ionicons name="arrow-forward" size={24} color="#36536b" />}
                        titleStyle={styles.listTitle}
                    />
                    
                </List.Section>
            </View>   
        </BackgroundComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4f9acc', // Matching the profile background color
        height: 200
    },
    avatar: {
        backgroundColor: '#4f7391',
    },
    userInfoSection: {
        alignItems: 'center',
        padding: 8,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        marginTop: 8,
    },
    userRole: {
        fontSize: 18,
        color: 'white',
        marginBottom: 16,
    },
    listContainer: {
        flex: 1,
        width: '100%',
        // marginTop: 16,
        backgroundColor: '#e9f5fb'
    },
    listTitle: {
        fontSize: 16,
        color: '#434444',
        // fontWeight: 'bold'
    },
    listDescription: {
        fontSize: 14,
    },
    listSection: {
        flex: 1,
        width: '100%',
        marginTop: 16,
    },

    // Style for the List.Item separator
    listItem: {
        borderBottomColor: 'white', // Color of the separator line
        borderBottomWidth: 1, // Thickness of the separator line
        marginLeft: 27,
        marginRight: 17
    },
    // Add any additional styling you may need here
});

export default PersonalScreen;
