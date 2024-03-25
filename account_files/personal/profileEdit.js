import React, { useState } from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';


const ProfileEdit = () => {
  const [userInfo, setUserInfo] = useState({
    avatar: 'path-to-avatar',
    name: 'Mathilda',
    gender: 'Female',
  });

  const navigation = useNavigation();

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const showNameModal = () => setNameModalVisible(true);
  const hideNameModal = () => setNameModalVisible(false);

  const showGenderModal = () => setGenderModalVisible(true);
  const hideGenderModal = () => setGenderModalVisible(false);



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

  const renderNameModal = () => {
    const [newName, setNewName] = useState(userInfo.name);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={nameModalVisible}
        onRequestClose={hideNameModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                setUserInfo({ ...userInfo, name: newName });
                hideNameModal();
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };


  const renderGenderModal = () => {
    const [newGender, setNewGender] = useState(userInfo.gender);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={hideGenderModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Picker
              selectedValue={newGender}
              onValueChange={(itemValue, itemIndex) => setNewGender(itemValue)}
              style={styles.pickerStyle}
            >
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                setUserInfo({ ...userInfo, gender: newGender });
                hideGenderModal();
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };



  const handleAvatarPress = () => {
    setAvatarModalVisible(true);
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
        {/* <ListItemWithDescription
          title="Your Avatar"
          description={userInfo.avatar}
          onPress={handleAvatarPress}
        /> */}
        <ListItemWithDescription
          title="Your Name"
          description={userInfo.name}
          onPress={showNameModal}
        />
        <ListItemWithDescription
          title="Your Gender"
          description={userInfo.gender}
          onPress={showGenderModal}
        />
      </List.Section>

      {renderAvatarModal()}
      {renderNameModal()}
      {renderGenderModal()}
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
    backgroundColor: "#e0e0e0",
  },
  submitButtonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  }

});

export default ProfileEdit;

