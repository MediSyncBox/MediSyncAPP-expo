import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ProfileEdit = () => {
  const navigation = useNavigation();


  const userInfo = {
    avatar: 'path-to-avatar',
    name: 'Mathilda',
    gender: 'Female',
  };

  const handleAvatarPress = () => {
    navigation.navigate('EditAvatar', { avatar: userInfo.avatar });
  };

  const handleNamePress = () => {
    navigation.navigate('EditName', { name: userInfo.name });
  };

  const handleGenderPress = () => {
    navigation.navigate('EditGender', { gender: userInfo.gender });
  };

  return (
    <View style={styles.container}>
      <List.Section style={styles.selection}>
        <List.Item
          title="Your Avatar"
          description={() => (
            <View style={styles.listItemDescription}>
              <Text style={styles.listItemText}>{userInfo.name}</Text>
            </View>
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={handleAvatarPress}
        />
        <List.Item
          title="Your Name"
          description={() => (
            <View style={styles.listItemDescription}>
              <Text style={styles.listItemText}>{userInfo.name}</Text>
            </View>
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={handleNamePress}
        />
        <List.Item
          title="Your Gender"
          description={() => (
            <View style={styles.listItemDescription}>
              <Text style={styles.listItemText}>{userInfo.name}</Text>
            </View>
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={handleGenderPress}
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

export default ProfileEdit;
