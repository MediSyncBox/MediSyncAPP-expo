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

  const ListItemWithDescription = ({ title, description, onPress }) => (
    <List.Item
      title={(
        <View style={styles.listItemRow}>
          <Text style={styles.listItemTitle}>{title}</Text>
          <Text style={styles.listItemDescription}>{description}</Text>
        </View>
      )}
      right={() => <List.Icon icon="chevron-right" />}
      onPress={onPress}
      titleNumberOfLines={2}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <List.Section style={styles.selection}>
        <ListItemWithDescription
          title="Your Avatar"
          description={userInfo.avatar}
          onPress={handleAvatarPress}
        />
        <ListItemWithDescription
          title="Your Name"
          description={userInfo.name}
          onPress={handleNamePress}
        />
        <ListItemWithDescription
          title="Your Gender"
          description={userInfo.gender}
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
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemDescription: {
    fontSize: 16,
    color: 'grey',
  },
  listItem: {
    paddingVertical: 15,
  },

});

export default ProfileEdit;

