import React, { useState } from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ProfileEdit = () => {
  const navigation = useNavigation();

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);


  const userInfo = {
    avatar: 'path-to-avatar',
    name: 'Mathilda',
    gender: 'Female',
  };

  const renderAvatarModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={avatarModalVisible}
        onRequestClose={() => {
          setAvatarModalVisible(!avatarModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // TODO: Handle 'Select from your album'
                setAvatarModalVisible(!avatarModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Select from your album</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // TODO: Handle 'Take a picture'
                setAvatarModalVisible(!avatarModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Take a picture</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setAvatarModalVisible(!avatarModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };



  const handleAvatarPress = () => {
    setAvatarModalVisible(true);
  };

  const handleNamePress = () => {
    // navigation.navigate('EditName', { name: userInfo.name });
  };

  const handleGenderPress = () => {
    // navigation.navigate('EditGender', { gender: userInfo.gender });
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

      {renderAvatarModal()}
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
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemDescription: {
    fontSize: 16,
    color: 'grey',
    marginTop: 4,
  },
  listItem: {
    paddingVertical: 15,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0", // 灰色分隔线
  },

});

export default ProfileEdit;

