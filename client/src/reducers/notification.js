import { 
  GET_NOTIFICATIONS, 
  MARK_NOTIFICATION_READ, 
  NOTIFICATION_ERROR 
} from '../actions/types';

const initialState = {
  notifications: [],
  loading: true,
  error: null
};

export default function notificationReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        loading: false
      };
      case MARK_NOTIFICATION_READ:
        return {
          ...state,
          notifications: state.notifications.map(notif =>
            notif._id === action.payload ? { ...notif, read: true } : notif
          ),
          loading: false
        };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}