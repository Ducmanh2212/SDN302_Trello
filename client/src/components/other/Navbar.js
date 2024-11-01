// Trong components/layout/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/auth';
import { getNotifications } from '../../actions/notification';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Notifications from '../notifications/Notifications';

const useStyles = makeStyles((theme) => ({
  notificationPopover: {
    width: '350px',
    maxHeight: '500px',
    overflow: 'auto'
  },
  notificationIcon: {
    cursor: 'pointer',
    color: 'white',
    '&:hover': {
      opacity: 0.8
    }
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const notifications = useSelector((state) => state.notification.notifications || []);
  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationRead = () => {
    dispatch(getNotifications());
  };

  const open = Boolean(anchorEl);

  if (!isAuthenticated) return '';

  return (
    <nav className="navbar">
      <Link to="/dashboard">Home</Link>
      <Link to="/dashboard">TrelloClone</Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Badge 
          badgeContent={unreadCount > 0 ? unreadCount : null}
          color="secondary"
          className={classes.notificationIcon}
          onClick={handleNotificationClick}
        >
          <NotificationsIcon />
        </Badge>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{
            paper: classes.notificationPopover
          }}
        >
          <Notifications 
            onClose={handleClose}
            onNotificationRead={handleNotificationRead}
          />
        </Popover>
        <Link to="/" onClick={() => dispatch(logout())}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
