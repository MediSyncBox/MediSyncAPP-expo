import React, { Component } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Agenda } from "react-native-calendars"
import example from "./testIDs"
import PlusButton from "./PlusButton"
import DisplayModal from "./DisplayModal"
import EditModal from "./EditModal"
import axios from 'axios';
import { useAuth } from '../AuthContext'

export default class AgendaScreen extends Component {

  state = {
    //  initially have no entries until they are loaded dynamically.
    items: undefined,
    modalVisible: false,
    editModalVisible: false,
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
          <DisplayModal modalVisible={this.state.modalVisible} 
            setModalVisible={this.setModalVisible} 
            initialData={example.exampleSchedule}
            // onEditPress={handleEditPress}
            setEditModalVisible={this.setEditModalVisible}
          />
        </View>

        <View>
          <EditModal
            modalVisible={this.state.editModalVisible}
            setModalVisible={this.setEditModalVisible}
            mode="edit"
            submitForm={this.handleEditSubmit}
            initialData={example.exampleSchedule}
          />
        </View>

      </View>
    )
  }

  // loadItems = day => {
  //   const items = this.state.items || {}

  //   setTimeout(() => {
  //     for (let i = -15; i < 85; i++) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000
  //       const strTime = this.timeToString(time)

  //       if (!items[strTime]) {
  //         items[strTime] = []

  //         const numItems = Math.floor(Math.random() * 3 + 1)
  //         for (let j = 0; j < numItems; j++) {
  //           items[strTime].push({
  //             name: "Item for " + strTime + " #" + j,
  //             height: Math.max(50, Math.floor(Math.random() * 150)),
  //             day: strTime
  //           })
  //         }
  //       }
  //     }

  //     const newItems = {}
  //     Object.keys(items).forEach(key => {
  //       newItems[key] = items[key]
  //     })
  //     this.setState({
  //       items: newItems
  //     })
  //   }, 1000)
  // }
  loadItems = day => {
    const { user_id } = this.props;
    // const { user_id } = this.props; // Assuming you pass the user_id as a prop to the component
    const baseUrl = 'https://medisyncconnection.azurewebsites.net/api'; // Replace with your actual server URL
  
    axios.get(`${baseUrl}/getSchedules/${user_id}`)
      .then(response => {
        const items = this.state.items || {};
  
        // Process the response to fit into the required structure for the Agenda component
        response.data.forEach((schedule) => {
          const strTime = schedule.time.split('T')[0]; // Assuming the date format is YYYY-MM-DDTHH:mm:ss
          if (!items[strTime]) {
            items[strTime] = [];
          }
          items[strTime].push({
            name: schedule.medicine + " - " + (schedule.dose ? schedule.dose + ' dose' : 'No dose info'),
            height: Math.max(50, Math.floor(Math.random() * 150)), // Adjust the height as necessary
            day: strTime,
            time: schedule.time,
            taken: schedule.taken
          });
        });
  
        const newItems = {};
        Object.keys(items).forEach(key => {
          newItems[key] = items[key];
        });
  
        this.setState({
          items: newItems
        });
      })
      .catch(error => {
        console.error("Error fetching schedules: ", error);
        // Handle error appropriately
      });
  }

  renderDay = day => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>
    }
    return <View style={styles.dayItem} />
  }

  // TODO: change the logic, if hasRenderItem then show else empty
  renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14
    const color = isFirst ? "black" : "#43515c"

    return (
      <TouchableOpacity
        // testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: reservation.height }]}
        onPress={() => this.setModalVisible(true)}
      >
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    )
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
})
