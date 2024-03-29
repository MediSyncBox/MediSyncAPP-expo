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

export default class AgendaScreen extends Component {
  
  // state = {
  //   //  initially have no entries until they are loaded dynamically.
  //   items: undefined,
  //   modalVisible: false,
  //   editModalVisible: false,
  // }
  state = {
    items: undefined,
    modalVisible: false,
    editModalVisible: false,
    selectedItem: null, // Add this line
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
          // testID={testIDs.agenda.CONTAINER}
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          //        selected={'2024-02-07'}
          // have two modal, for edit is one, another is for showing
          renderItem={this.renderItem}
          renderEmptyDate={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          showClosingKnob={true}
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
    // Create a new Date object from the schedule time
    const scheduleDateTime = new Date(reservation.time);
  
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.setState({ selectedItem: reservation, editModalVisible: true }, () => {
            // This callback function gets executed after the state has been updated.
            // console.warn(this.state.selectedItem);
          });
        }}
      >
        <Text style={styles.itemText}>Medicine: {reservation.name}</Text>
        <Text style={styles.itemText}>Dose: {reservation.dose || 'No dose info'} pills</Text>
        {/* Render both date and time */}
        <Text style={styles.itemText}>Time: {scheduleDateTime.toLocaleTimeString()}</Text>
        <Text style={styles.itemText}>Taken: {reservation.taken ? 'Yes' : 'No'}</Text>
      </TouchableOpacity>
    )
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
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    minHeight: 100, // Ensure each item has at least a height of 100
    justifyContent: 'center' // Center the content vertically
  },
  itemText: {
    fontSize: 14,
    color: "#43515c"
  },
})
