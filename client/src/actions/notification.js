// Trong actions/notification.js
import axios from 'axios';
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ, NOTIFICATION_ERROR } from './types';

// Lấy tất cả thông báo
export const getNotifications = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/notifications');
    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status },
    });
  }
};

// Đánh dấu thông báo đã đọc
export const markNotificationRead = (id) => async (dispatch) => {
  try {
    // Sửa lại template string
    await axios.put(`/api/notifications/${id}`);
    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response?.statusText || 'Server Error', status: err.response?.status },
    });
  }
};
