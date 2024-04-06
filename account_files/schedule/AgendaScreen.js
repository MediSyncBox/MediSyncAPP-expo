import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import PlusButton from './PlusButton';
import EditSchedule from './EditSchedule';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomAppbar from './Appbar';
import {loadItemsApi} from '../api/schedule';
import { useAuth } from '../AuthContext';

const AgendaScreen = (props) => {
  const [items, setItems] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [agendaKey, setAgendaKey] = useState(0);
  const [shouldRefreshAgenda, setShouldRefreshAgenda] = useState(false);
  const { user_id } = props;
  const { currentPatient, setCurrentPatient } = useAuth();

  const isEmptyItems = () => {
    if (!items) return true;
    return Object.keys(items).every(key => items[key].length === 0);
  };

  // useEffect(() => {
  //   if (user_id) {
  //     loadItemsForMonth().then(() => {
  //       setAgendaKey(prevKey => prevKey + 1);
  //     });
  //   }
  // }, [user_id]);

  useEffect(() => {
    if (shouldRefreshAgenda) {
      setItems({});
      loadItemsForMonth();
      setAgendaKey(prevKey => prevKey + 1);
      setShouldRefreshAgenda(false);
    }
  }, [shouldRefreshAgenda]);

  const loadItemsForMonth = async (fromDate) => {
    // setItems({});
    try {
      // 根据currentPatient是否为数组，获取所有用户ID
      if (currentPatient === null) {
        console.log("No current patient selected.");
        return; // 提前返回，避免执行API调用
      }
      const user_ids = Array.isArray(currentPatient) ? currentPatient.map(p => p.id) : [currentPatient.id];
      // console.warn(currentPatient)
      await loadItemsApi(user_ids, items, setItems, fromDate);
      // 可选：在这里执行后续逻辑，例如设置刷新标志
    } catch (error) {
      console.error('Failed to load items: ', error);
    }
  };

  const loadFromDate = async (fromDate) => {
    // setShouldRefreshAgenda(true);
    setItems({});
    loadItemsForMonth(fromDate);
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
    setShouldRefreshAgenda(true);
  };

  const renderItem = (reservation) => {
    // console.warn(reservation)
    // console.warn(agendaKey)
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
    // 确保这里的逻辑足够识别你的数据模型中的变化
    console.warn(r1)
    return r1.id !== r2.id || r1.last_updated !== r2.last_updated;
};

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };
  // console.warn(currentPatient.length !== 1)

  return (
    <View style={{ paddingTop: 25, flex: 1 }}>
      <CustomAppbar setShouldRefreshAgenda={setShouldRefreshAgenda} items={items} setItems={setItems}/>
      <Agenda
        key={agendaKey}
        items={items}
        loadItemsForMonth={loadItemsForMonth}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        // rowHasChanged={rowHasChanged}
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

