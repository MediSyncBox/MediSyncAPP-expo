// export default {
//   exampleSchedule: {
//     medicine: "Ibuprofen",
//     dose: "200mg",
//     doseTimes: [
//       new Date(new Date().setHours(8, 0, 0, 0)),
//       new Date(new Date().setHours(14, 0, 0, 0)),
//       new Date(new Date().setHours(20, 0, 0, 0)),
//     ],
//     startDate: new Date("2023-10-01"),
//     endDate: new Date("2023-10-14"),
//   }
// };

// // const exampleSchedule = {
// //   medicine: "Ibuprofen",
// //   dose: "200mg",
// //   timesPerDay: 3,
// //   startDate: "2023-10-01",
// //   endDate: "2023-10-14"
// // };

// // export default {
// //   menu: {
// //     CONTAINER: 'menu',
// //     CALENDARS: 'calendars_btn',
// //     CALENDAR_LIST: 'calendar_list_btn',
// //     HORIZONTAL_LIST: 'horizontal_list_btn',
// //     AGENDA: 'agenda_btn',
// //     EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
// //     WEEK_CALENDAR: 'week_calendar_btn',
// //     TIMELINE_CALENDAR: 'timeline_calendar_btn',
// //     PLAYGROUND: 'playground_btn'
// //   },
// //   calendars: {
// //     CONTAINER: 'calendars',
// //     FIRST: 'first_calendar',
// //     LAST: 'last_calendar'
// //   },
// //   calendarList: {CONTAINER: 'calendarList'},
// //   horizontalList: {CONTAINER: 'horizontalList'},
// //   agenda: {
// //     CONTAINER: 'agenda',
// //     ITEM: 'item'
// //   },
// //   expandableCalendar: {CONTAINER: 'expandableCalendar'},
// //   weekCalendar: {CONTAINER: 'weekCalendar'}
// // };

import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Agenda } from 'react-native-calendars';
import PlusButton from './PlusButton';
import EditSchedule from './EditSchedule';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomAppbar from './Appbar';
import {loadItemsApi} from '../api/schedule';
import { useAuth } from '../AuthContext';
// import DeleteModeButton from './DeleteButton';

const AgendaScreen = (props) => {
  const [items, setItems] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [agendaKey, setAgendaKey] = useState(0);
  const [shouldRefreshAgenda, setShouldRefreshAgenda] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { user_id } = props;
  const { currentPatient, setCurrentPatient } = useAuth();
  const [batchSelect, setBatchSelect] = useState(false);

  // useEffect(() => {
  //   if (user_id) {
  //     loadItemsForMonth().then(() => {
  //       setAgendaKey(prevKey => prevKey + 1);
  //     });
  //   }
  // }, [user_id]);

  // loading and refresh schedules
  useEffect(() => {
    if (shouldRefreshAgenda) {
      // i don't like that, i think it makes low efficiency but i don't know how to fix that
      // there is also logic of agenda reservation get involve, it's probably bad idea to use that
      setItems({});
      loadItemsForMonth();
      setAgendaKey(prevKey => prevKey + 1);
      setShouldRefreshAgenda(false);
    }
  }, [shouldRefreshAgenda]);

  const loadItemsForMonth = async (fromDate) => {
    // keep fetching schedules
    try {
      if (currentPatient === null) {
        console.log("No current patient selected.");
        return;
      }
      const user_ids = Array.isArray(currentPatient) ? currentPatient.map(p => p.id) : [currentPatient.id];
      // console.warn(currentPatient)
      await loadItemsApi(user_ids, items, setItems, fromDate);
    } catch (error) {
      console.error('Failed to load items: ', error);
    }
  };
  
  // update taken by toggle
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
    setShouldRefreshAgenda(true);
  };

  // Agenda parameters
  const loadFromDate = async (fromDate) => {
    // setShouldRefreshAgenda(true);
    setItems({});
    loadItemsForMonth(fromDate);
  };

  const isEmptyItems = () => {
    if (!items) return true;
    return Object.keys(items).every(key => items[key].length === 0);
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.id !== r2.id || r1.last_updated !== r2.last_updated || batchSelect;
  };

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const toggleItemSelected = (reservation) => {
    const index = selectedItems.findIndex(item => item.id === reservation.id);
    if (index === -1) {
      // Item not found, add to selected items
      setSelectedItems([...selectedItems, reservation]);
    } else {
      // Item found, remove from selected items
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
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
          {batchSelect && ( // Render checkbox only if batch select mode is enabled
            <TouchableOpacity
              style={styles.batchSelectCheckbox}
              onPress={() => toggleItemSelected(reservation)} // Toggle item selection
            >
              <Ionicons
                name={selectedItems.some(item => item.id === reservation.id) ? "checkbox-outline" : "square-outline"}
                size={24}
                color={selectedItems.some(item => item.id === reservation.id) ? "blue" : "black"}
              />
            </TouchableOpacity>
          )}
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
            {/* <Ionicons name="alert-circle" size={24} color="#43515c" style={styles.icon} /> */}
            <Text style={[styles.itemText, { fontSize: 18 }]}>{reservation.name}</Text>
          </View>
          <View style={styles.itemFooter}>
            <Ionicons name="time" size={18} color="#43515c" style={styles.icon} />
            <Text style={styles.itemText}>{scheduleDateTime.toLocaleTimeString()}</Text>
            <Ionicons name="water" size={18} color="#43515c" style={[styles.icon, { marginLeft: 55 }]} />
            <Text style={[styles.itemText, ]}>{reservation.dose || 'No dose info'} pill</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title={batchSelect ? "Cancel Batch Select" : "Batch Select"} onPress={() => setBatchSelect(!batchSelect)} />
      <CustomAppbar setShouldRefreshAgenda={setShouldRefreshAgenda} items={items} setItems={setItems}/>
      <Agenda
        key={agendaKey}
        items={items}
        loadItemsForMonth={loadItemsForMonth}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        // onDayPress={({dateString}) => loadItemsForMonth(dateString)}
        onDayPress={({dateString}) => loadFromDate(dateString)}
        showClosingKnob={true}
        refreshing={props.refreshing}
        onRefresh={props.onRefresh}
        renderEmptyData={() => isEmptyItems() ? <View style={styles.emptyData}><Text>You don't have a schedule</Text></View> : null}
      />

      <View>
        <PlusButton items={items} setItems={setItems} setShouldRefreshAgenda={setShouldRefreshAgenda}/>
      </View>

      <EditSchedule
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        submitForm={() => {}}
        initialData={selectedItem}
        setShouldRefreshAgenda={setShouldRefreshAgenda}
        userId={user_id}
        items={items}
        setItems={setItems}
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
    elevation: 3,
  },
  itemText: {
    fontSize: 16, // Make text larger
    color: "#43515c",
    marginBottom: 3, // Add spacing between text elements
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    left: 5,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    // top: 5, // Adjust as necessary
    left: 5, // Adjust as necessary
    // padding: 5,
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

