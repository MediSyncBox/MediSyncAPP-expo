import React, { Component } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Agenda } from "react-native-calendars"
import example from "./testIDs"
import PlusButton from "./PlusButton"
import DisplayModal from "./DisplayModal"
import EditModal from "./AddSchedule"
import EditSchedule from './EditSchedule'
import axios from 'axios';
import { useAuth } from '../AuthContext'
// import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default class AgendaScreen extends Component {

  state = {
    items: undefined,
    modalVisible: false,
    editModalVisible: false,
    selectedItem: null, // Add this line
  }

  isEmptyItems = () => {
    const { items } = this.state;
    if (!items) return true; // Items object is undefined
    return Object.keys(items).every(key => items[key].length === 0);
  }
  
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setEditModalVisible = (visible) => {
    this.setState({ editModalVisible: visible });
  };

  render() {
    return (
      <View style={{ paddingTop: 25, flex: 1 }}>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          renderItem={this.renderItem}
          renderEmptyDate={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          showClosingKnob={true}
          refreshing={this.props.refreshing}
          onRefresh={this.props.onRefresh}
          renderEmptyData={() => this.isEmptyItems() ? <View style={styles.emptyData}><Text>You don't have a schedule</Text></View> : null}
      />
        
        <View style={styles.footerContainer}>
          <PlusButton/>
        </View>
        
        <View>
          <EditSchedule
            modalVisible={this.state.editModalVisible}
            setModalVisible={this.setEditModalVisible}
            mode="edit"
            submitForm={this.handleEditSubmit}
            initialData={this.state.selectedItem} // Pass selectedItem as initialData
          />
        </View>


      </View>
    )
  }

  loadItems = day => {
    const { user_id } = this.props;
    const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';
  
    axios.get(`${baseUrl}/getSchedules/${user_id}`)
      .then(response => {
        const newItems = { ...this.state.items }; // Spread into a new object to avoid direct state mutation
  
        // Process the response
        response.data.forEach(schedule => {
          const strTime = this.timeToString(new Date(schedule.time));
          if (!newItems[strTime]) {
            newItems[strTime] = [];
          }
  
          // Here you could add a check to ensure no duplicates are added
          // For example, by using some unique identifier of schedules
          const isDuplicate = newItems[strTime].some(item => item.id === schedule.id);
          if (!isDuplicate) {
            newItems[strTime].push({
              id: schedule.id, // Assuming each schedule has a unique 'id'
              user: schedule.user_id,
              name: schedule.medicine,
              dose: schedule.dose,
              time: schedule.time,
              taken: schedule.taken,
              height: 100
            });
          }
        });
  
        this.setState({ items: newItems });
      })
      .catch(error => {
        console.error("Error fetching schedules: ", error);
      });
  }
  

  renderDay = day => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>
    }
    return <View style={styles.dayItem} />
  }

  renderItem = (reservation) => {
    const scheduleDateTime = new Date(reservation.time);
  
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.setState({ selectedItem: reservation, editModalVisible: true });
        }}
      >
        <View style={styles.itemHeader}>
          <Ionicons name="sync-circle" size={24} color="#43515c" style={styles.icon} />
          <Text style={[styles.itemText, { fontSize: 18 }]}>Medicine: {reservation.name}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Ionicons name="time" size={20} color="#43515c" style={styles.icon} />
          <Text style={styles.itemText}>Time: {scheduleDateTime.toLocaleTimeString()}</Text>
          <Text style={[styles.itemText, { marginLeft: 'auto' }]}>Dose: {reservation.dose || 'No dose info'} pills</Text>
        </View>
        <Text style={styles.itemText}>Taken: {reservation.taken ? 'Yes' : 'No'}</Text>
      </TouchableOpacity>
    );
  }
  
  timeToString = (time) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name
  }

  timeToString(time) {
    const date = new Date(time)
    return date.toISOString().split("T")[0]
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
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
    marginTop: 7,
    minHeight: 80, // Reduced minHeight for compactness
    justifyContent: 'center', // Center the content vertically
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // elevation: 4,
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
})

