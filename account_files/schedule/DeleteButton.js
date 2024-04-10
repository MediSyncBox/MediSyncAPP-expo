import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const DeleteModeButton = ({ isInDeleteMode, setIsInDeleteMode, handleDeleteSelectedItems }) => {
  return (
    <View style={styles.deleteButtonContainer}>
      <TouchableOpacity
        onPress={() => {
          if (isInDeleteMode) {
            handleDeleteSelectedItems(); // 调用函数来处理选中项的删除
          }
          setIsInDeleteMode(!isInDeleteMode); // 切换删除模式
        }}
        style={styles.deleteButton}
      >
        <Ionicons
          name={isInDeleteMode ? 'trash-bin' : 'trash-outline'}
          size={24}
          color="white"
        />
        <Text style={styles.deleteButtonText}>
          {isInDeleteMode ? 'Delete' : 'Edit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButtonContainer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    zIndex: 1,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default DeleteModeButton;
