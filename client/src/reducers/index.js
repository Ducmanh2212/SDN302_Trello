import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import board from './board';
import notification from './notification'; // Thêm dòng này

export default combineReducers({ 
  alert, 
  auth, 
  board,
  notification // Thêm dòng này
});