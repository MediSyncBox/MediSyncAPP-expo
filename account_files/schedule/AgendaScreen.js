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
import { useNotification } from '../NotificationContext';
import * as Notifications from 'expo-notifications';

const AgendaScreen = (props) => {
  const [items, setItems] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [agendaKey, setAgendaKey] = useState(0);
  const [shouldRefreshAgenda, setShouldRefreshAgenda] = useState(false);
  const { user_id } = props;
  const { currentPatient, setCurrentPatient } = useAuth();
  const { token } = useNotification();
  // const [scheduledNotifications, setScheduledNotifications] = useState({});
  let scheduledNotifications = [];

  const colors = [
    '#FFADAD', '#FFD6A5', '#584c3b', '#a9d0a1', '#237fbc', // pink, light brown, dark brown, green, blue
    '#A0C4FF', '#BDB2FF', '#FFC6FF', '#800000', '#BDB76B' // pueple blue, violet, bright pink, brick red, tellow green
  ];

  const isEmptyItems = () => {
    if (!items) return true;
    return Object.keys(items).every(key => items[key].length === 0);
  };

  const scheduleNotification = async (time, title, body) => {
    // console.warn(body)
    const schedulingOptions = {
      content: {
        title: title,
        body: body,
        sound: true, // 可选，如果你希望通知有声音
      },
      trigger: {
        date: time, // 确保time是一个JavaScript Date对象
      },
    };
    
  
    // 调用Notifications.scheduleNotificationAsync来安排通知
    const identifier = await Notifications.scheduleNotificationAsync(schedulingOptions);
    scheduledNotifications.push({ time, body }); 
    // await Notifications.scheduleNotificationAsync(schedulingOptions);
    // return identifier;
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
  // call = 0;
  const loadItemsForMonth = async (fromDate) => {
    // setItems({});
    // console.warn(items)
    // call = call + 1;
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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    await Notifications.cancelAllScheduledNotificationsAsync();
    Object.keys(items).forEach(date => {
      const itemDate = new Date(date);
      // console.warn(itemDate)
      // console.warn(new Date(now))
      // console.warn(itemDate >= new Date(now))
      if (itemDate >= todayStart && itemDate < todayEnd) {
        // console.warn('ww')
        items[date].forEach(async item => {
          
          const eventTime = new Date(item.time);
          const checkTime = new Date(eventTime.getTime() + 3 * 60 * 1000);
          const currentTime = new Date();
          const delayTime = checkTime - currentTime; 
          const resendTime = new Date(eventTime.getTime() + 4 * 60 * 1000);
          if (eventTime >= todayStart && eventTime < todayEnd) {
            const title = "Time to take pills!";
            const body = `Your have a ${item.name} schedule, with dose of ${item.dose}.`;
            // await scheduleNotification(eventTime, title, body)
            // .catch(error => {
            //   console.error("Failed to schedule notification:", error);
            // });
            await scheduleNotification(eventTime, title, body)
            .then(identifier => {
              setTimeout(async () => {
                const checkItem = items[date].find(i => i.id === item.id);
                if (checkItem && !checkItem.taken) {
                  await scheduleNotification(resendTime, title, body)
                    .then(reId => {
                      // console.warn(resendTime);
                    })
                    .catch(error => console.error("Failed to reschedule notification:", error));
                }
              }, delayTime); // 4
            })
            .catch(error => {
              console.error("Failed to schedule notification:", error);
            });
            // console.warn(scheduledNotifications)
          }
        });
      }
    });
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

  const getColorForUserId = (userId) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };  

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts.map(part => part[0].toUpperCase()).join('');  // 多个词的每个词的首字母
    }
    return parts[0].charAt(0).toUpperCase();  // 单词的首字母
  };

  const renderItem = (reservation) => {
    
    const scheduleDateTime = new Date(reservation.time);
    // const patient = currentPatient && currentPatient.find(p => p.id === reservation.user);
    const patient = Array.isArray(currentPatient) ? currentPatient.find(p => p.id === reservation.user) : currentPatient.userName;
    
    const userName = patient && patient.userName ? patient.userName : patient;
    // const initial = patient && patient.userName ? patient.userName.charAt(0).toUpperCase() : '?';
    const initials = getInitials(userName);
    const initialColor = getColorForUserId(userName);
    
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
        {/* {userName !== '' && (
            <View style={[styles.initialCircle, { backgroundColor: initialColor }]}>
              <Text style={styles.initialText}>{initials}</Text>
            </View>
          )} */}
        <View style={[styles.initialCircle, { backgroundColor: initialColor }]}>
          <Text style={styles.initialText}>{initials}</Text>
        </View>
        <TouchableOpacity
          style={[styles.itemTouchable, ]}
          onPress={() => handleTakenToggle(reservation)}
        >
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={reservation.taken ? "orange" : "rgb(128, 128, 128)"}
            style={styles.tickIcon}
          />
        </TouchableOpacity>
        <View style={styles.itemHeader}>
          <Text style={[styles.nameText, { fontSize: 18 }]}>{reservation.name}</Text>
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
            // agendaDayTextColor: 'yellow',
            // agendaDayNumColor: 'green',
            agendaTodayColor: '#3c80c4',
            agendaKnobColor: '#13296c',
            calendarBackground: 'white',
            reservationsBackgroundColor: '#dceffa',
            agendaTodayColor: '#3c80c4',
            selectedDayBackgroundColor: '#3c80c4',
            dotColor: '#13296c',
            dayTextColor: '#72b4e2',
            monthTextColor: '#3c80c4',
            todayTextColor: '#13296c',
            // selectedDayTextColor: 'red',
            // agendaDayTextColor: 'red',
            textDayFontWeight: 'bold',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
            // dayHeaderTextColor: 'red',
            // textMonthFontFamily: 'monospace',
            textMonthFontSize: 18,
            // todayButtonTextColor: 'red'
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
    borderRadius: 30,
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
    // color: "#dbdddf",
    color: "#43515c",
    marginBottom: 3, // Add spacing between text elements
    // fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16, // Make text larger
    color: "#dbdddf",
    color: "#43515c",
    marginBottom: 3, // Add spacing between text elements
    fontWeight: 'bold',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    left: 65,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 3, // Adjust as necessary
    left: 63, // Adjust as necessary
    // padding: 5,
  },
  initialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF', // 蓝色背景
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // top: 10,
    left: 10,
    zIndex: 2,
  },
  initialText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22
  },
  icon: {
    marginRight: 2,
    marginBottom: 1,
  },
  doseicon: {
    left: 30,
    marginBottom: 1,
  },
  doseText: {
    fontSize: 16, // Make text larger
    color: "#43515c",
    marginBottom: 2, // Add spacing between text elements
    marginLeft: 32,
  },
  itemTouchable: {
    position: 'absolute',
    top: 5, // Adjust as necessary
    right: 5, // Adjust as necessary
    padding: 5,
    borderRadius: 25,
  },
})