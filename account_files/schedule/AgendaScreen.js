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
// import { DeleteButton } from './DeleteButton';
import DeleteButton from './DeleteButton';
import BackgroundComponent from '../style/BackgroundComponent';
import { LinearGradient } from 'expo-linear-gradient';

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
      // i don't like that, i think it makes low efficiency but i don't know how to fix that
      // there is also logic of agenda reservation get involve, it's probably bad idea to use that
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
    //   <LinearGradient
    //   colors={['#c6dcee', '#ffffff']}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    //   style={{ borderRadius: 5, padding: 10, marginVertical: 5 }}
    // >
      <TouchableOpacity
        onPress={() => {
          setSelectedItem(reservation);
          setEditModalVisible(true);
        }}
      >
        <View style={styles.item} >
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
            <Text style={[styles.timeText, { fontSize: 18 }]}>{reservation.name}</Text>
          </View>
          <View style={styles.itemFooter}>
            <Ionicons name="time" size={18} color="#43515c" style={styles.icon} />
            <Text style={styles.timeText}>{scheduleDateTime.toLocaleTimeString()}</Text>
            <Ionicons name="water" size={18} color="#43515c" style={styles.doseicon} />
            <Text style={styles.doseText}>Dose: {reservation.dose || 'No dose info'}</Text>
          </View>
        </View>
      </TouchableOpacity>
      // </LinearGradient>
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
    return r1.id !== r2.id || r1.last_updated !== r2.last_updated;
};

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };
  // console.warn(currentPatient.length !== 1)

  return (
    // <BackgroundComponent>
      <View style={{ flex: 1 }}>
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
          theme={{
            reservationsBackgroundColor: '#c6dcee',
          }}
          renderEmptyData={() => isEmptyItems() ? <View style={styles.emptyData}>
            <Text>You don't have a schedule</Text></View> : null}
        />

        <View>
          <PlusButton items={items} setItems={setItems} setShouldRefreshAgenda={setShouldRefreshAgenda}/>
        </View>

        <View>
          <DeleteButton items={items} setItems={setItems} 
          currentPatient={currentPatient} setShouldRefreshAgenda={setShouldRefreshAgenda}/>
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
    // </BackgroundComponent>
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
  selectedItem: {
    backgroundColor: '#d3d3d3', // 一个示例高亮颜色
  },
  item: {
    backgroundColor: "white",
    borderRadius: 20,
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
    width: 300,
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  timeText: {
    fontSize: 16, // Make text larger
    color: "#43515c",
    marginBottom: 3, // Add spacing between text elements
  },
  doseText: {
    fontSize: 16, // Make text larger
    color: "#43515c",
    marginBottom: 2, // Add spacing between text elements
    marginLeft: 72,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    left: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 3, // Adjust as necessary
    left: 16, // Adjust as necessary
    // padding: 5,
  },
  icon: {
    marginRight: 2,
    marginBottom: 1,
  },
  doseicon: {
    left: 70,
    marginBottom: 1,
  },
  itemTouchable: {
    position: 'absolute',
    top: 5, // Adjust as necessary
    right: 5, // Adjust as necessary
    padding: 5,
  },
})