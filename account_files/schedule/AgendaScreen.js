import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import PlusButton from './PlusButton';
import EditSchedule from './EditSchedule';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

const AgendaScreen = (props) => {
  const [items, setItems] = useState(undefined);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const isEmptyItems = () => {
    if (!items) return true;
    return Object.keys(items).every(key => items[key].length === 0);
  };

  const loadItems = (day) => {
    const { user_id } = props;
    const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';

    axios.get(`${baseUrl}/getSchedules/${user_id}`)
      .then(response => {
        const newItems = { ...items };

        response.data.forEach(schedule => {
          const strTime = timeToString(new Date(schedule.time));
          if (!newItems[strTime]) {
            newItems[strTime] = [];
          }

          const isDuplicate = newItems[strTime].some(item => item.id === schedule.id);
          if (!isDuplicate) {
            newItems[strTime].push({
              id: schedule.id,
              user: schedule.user_id,
              name: schedule.medicine,
              dose: schedule.dose,
              time: schedule.time,
              taken: schedule.taken,
              height: 100,
            });
          }
        });

        setItems(newItems);
      })
      .catch(error => {
        console.error('Error fetching schedules: ', error);
      });
  };

  const handleTakenToggle = async (reservation) => {
    const updatedReservation = { ...reservation, taken: !reservation.taken };
    setItems(prevItems => ({
      ...prevItems,
      [timeToString(reservation.time)]: prevItems[timeToString(reservation.time)].map(item => item.id === reservation.id ? updatedReservation : item),
    }));

    try {
      await axios.post('https://medisyncconnection.azurewebsites.net/api/updateTakenStatus', {
        id: reservation.id,
        taken: updatedReservation.taken,
      });
    } catch (error) {
      console.error('Error updating taken status: ', error);
    }
  };

  const renderItem = (reservation) => {
    const scheduleDateTime = new Date(reservation.time);
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedItem(reservation);
          setEditModalVisible(true);
        }}
      >
        <View style={styles.item}>
          <TouchableOpacity
            style={[styles.itemTouchable, { backgroundColor: 'white' }]}
            onPress={() => handleTakenToggle(reservation)}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={reservation.taken ? "rgb(255, 92, 38)" : "rgb(128, 128, 128)"}
              style={styles.tickIcon}
            />
          </TouchableOpacity>
          <View style={styles.itemHeader}>
            <Ionicons name="sync-circle" size={24} color="#43515c" style={styles.icon} />
            <Text style={[styles.itemText, { fontSize: 18 }]}>Medicine: {reservation.name}</Text>
          </View>
          <View style={styles.itemFooter}>
            <Ionicons name="time" size={20} color="#43515c" style={styles.icon} />
            <Text style={styles.itemText}>Time: {scheduleDateTime.toLocaleTimeString()}</Text>
            <Text style={[styles.itemText, { marginLeft: 'auto' }]}>Dose: {reservation.dose || 'No dose info'} pills</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={{ paddingTop: 25, flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        showClosingKnob={true}
        refreshing={props.refreshing}
        onRefresh={props.onRefresh}
        renderEmptyData={() => isEmptyItems() ? <View style={styles.emptyData}><Text>You don't have a schedule</Text></View> : null}
      />

      <View style={styles.footerContainer}>
        <PlusButton />
      </View>

      <EditSchedule
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        mode="edit"
        submitForm={() => {}}
        initialData={selectedItem}
      />
    </View>
  );
};

export default AgendaScreen;

// Add your styles object below


const styles = StyleSheet.create({
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green"
  },
  dayItem: {
    marginLeft: 34
  },
  footerContainer: {
    // flex: 1 / 3,
    // marginBottom: 100,
    alignItems: 'center',
  },
  item: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8, // Reduced padding
    marginRight: 10,
    marginTop: 10,
    minHeight: 80, // Reduced minHeight for compactness
    justifyContent: 'center', // Center the content vertically
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // elevation: 2,
  },
  itemText: {
    fontSize: 16, // Make text larger
    color: "#43515c",
    marginBottom: 5, // Add spacing between text elements
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  itemTouchable: {
    position: 'absolute',
    top: 5, // Adjust as necessary
    right: 5, // Adjust as necessary
    padding: 5,
  },
})

