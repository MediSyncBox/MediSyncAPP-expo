// api.js
import axios from 'axios';

const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';

const loadItemsApi = async (user_id, items, setItems) => {
  
  try {
    const response = await axios.get(`${baseUrl}/getSchedules/${user_id}`);
    const fetchedItems = response.data;
    
    const newItems = { ...items };
    fetchedItems.forEach(schedule => {
      const strTime = schedule.time.split('T')[0]; // Assumes that time is formatted as an ISO string

      if (!newItems[strTime]) {
        newItems[strTime] = [];
      }

      const index = newItems[strTime].findIndex(item => item.id === schedule.id);

      if (index >= 0) {
        // If item exists, replace it if the fetched item is newer
        if (new Date(schedule.last_updated) > new Date(newItems[strTime][index].last_updated)) {
          newItems[strTime][index] = { ...schedule, last_updated: new Date(schedule.last_updated) };
        }
      } else {
        newItems[strTime].push({
                      id: schedule.id,
                      user: schedule.user_id,
                      name: schedule.medicine,
                      dose: schedule.dose,
                      time: schedule.time,
                      taken: schedule.taken,
                      last_updated: schedule.last_updated,
                      height: 100,
                    });
      }
    });

    Object.keys(newItems).forEach(date => {
      newItems[date].sort((a, b) => new Date(a.time) - new Date(b.time));
    });

    setItems(newItems);
    // console.warn(newItems)
  } catch (error) {
    console.error('Error fetching schedules: ', error);
    throw error;
  }
};

export { loadItemsApi };