// PersonalScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import ProfileEdit from './profileEdit';
import { useNavigation } from '@react-navigation/native';

const PersonalScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity 
            style={styles.header} 
            onPress={() => navigation.navigate('ProfileEdit')}
            activeOpacity={1} >
                <Avatar.Image
                    size={80}
                    source={require('./img/account-box-plus-outline.png')}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>User Name</Text>
                </View>
                <List.Icon icon="pencil" />
            </TouchableOpacity>
            <List.Section style={styles.selection}>
                <List.Item
                    title="My Medical Record"
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => console.log('Edit profile')}
                />
                <List.Item
                    title="xxx"
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => console.log('Edit profile')}
                />
                <List.Item
                    title="Settings"
                    right={() => <List.Icon icon="chevron-right" />}
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
