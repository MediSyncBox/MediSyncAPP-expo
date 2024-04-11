// // api.js
// import axios from 'axios';

// const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';

// const loadItemsApi = async (user_ids, items, setItems) => {
//   // 初始化newItems对象，预先过滤掉与当前用户ID列表不匹配的日程
//   // console.warn(user_ids);
//   const newItems = Object.keys(items).reduce((acc, date) => {
//     acc[date] = items[date].filter(item => user_ids.includes(item.user));
//     return acc;
//   }, {});

//   try {
//     for (const user_id of user_ids) {
//       const response = await axios.get(`${baseUrl}/getSchedules/${user_id}`);
//       const fetchedItems = response.data;

//       fetchedItems.forEach(schedule => {
//         const strTime = schedule.time.split('T')[0]; // Assumes time is formatted as an ISO string

//         if (!newItems[strTime]) {
//           newItems[strTime] = [];
//         }

//         const index = newItems[strTime].findIndex(item => item.id === schedule.id);
//         if (index >= 0) {
//           // 如果找到匹配项，检查并更新
//           if (new Date(schedule.last_updated) > new Date(newItems[strTime][index].last_updated)) {
//             newItems[strTime][index] = {
//               id: schedule.id,
//               user: schedule.user_id,
//               name: schedule.medicine,
//               dose: schedule.dose,
//               time: schedule.time,
//               taken: schedule.taken,
//               last_updated: schedule.last_updated,
//               height: 100,
//             };
//           }
//         } else {
//           // 如果没有找到，添加新日程
//           newItems[strTime].push({
//             id: schedule.id,
//             user: schedule.user_id,
//             name: schedule.medicine,
//             dose: schedule.dose,
//             time: schedule.time,
//             taken: schedule.taken,
//             last_updated: schedule.last_updated,
//             height: 100,
//           });
//         }
//       });
//     }

//     // 排序并更新
//     Object.keys(newItems).forEach(date => {
//       newItems[date].sort((a, b) => new Date(a.time) - new Date(b.time));
//     });

//     setItems(newItems);
//   } catch (error) {
//     console.error('Error fetching schedules: ', error);
//     throw error;
//   }
// };


// export { loadItemsApi };

import axios from 'axios';

const baseUrl = 'https://medisyncconnection.azurewebsites.net/api';

const loadItemsApi = async (user_ids, items, setItems, fromDate=null) => {
  let newItems = {};
  // setItems({});
  // console.warn(user_ids)

  try {
    const schedulePromises = user_ids.map(async user_id => {
      const response = await axios.get(`${baseUrl}/getSchedules/${user_id}`);
      return response.data; 
    });

    const schedulesArray = await Promise.all(schedulePromises);
    const filteredSchedulesArray = fromDate 
      ? schedulesArray.map(schedules => schedules.filter(schedule => new Date(schedule.time) >= new Date(fromDate)))
      : schedulesArray;

    // 合并所有日程到newItems中
    schedulesArray.forEach(schedules => {
      schedules.forEach(schedule => {
        const strTime = schedule.time.split('T')[0]; // Assumes time is formatted as an ISO string

        if (!newItems[strTime]) {
          newItems[strTime] = [];
        }

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
      });
    });

    Object.keys(newItems).forEach(date => {
      newItems[date].sort((a, b) => new Date(a.time) - new Date(b.time));
    });

    setItems(newItems); // 使用setItems更新状态
  } catch (error) {
    console.error('Error fetching schedules: ', error);
    throw error;
  }
};

export { loadItemsApi };
