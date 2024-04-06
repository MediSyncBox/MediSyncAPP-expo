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

const loadItemsApi = async (user_ids, items, setItems) => {
  let newItems = {}; // 初始化一个新的空对象来存储所有日程
  // setItems({});
  // console.warn(user_ids)

  try {
    // 对每个user_id并行执行数据获取操作
    const schedulePromises = user_ids.map(async user_id => {
      const response = await axios.get(`${baseUrl}/getSchedules/${user_id}`);
      return response.data; // 返回获取到的日程数据
    });

    // 使用Promise.all等待所有请求完成
    const schedulesArray = await Promise.all(schedulePromises);

    // 合并所有日程到newItems中
    schedulesArray.forEach(schedules => {
      schedules.forEach(schedule => {
        const strTime = schedule.time.split('T')[0]; // Assumes time is formatted as an ISO string

        if (!newItems[strTime]) {
          newItems[strTime] = []; // 如果这个日期还没有被加入到newItems，就创建一个空数组
        }

        // 直接添加新日程
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

    // 对每个日期下的日程进行排序
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
