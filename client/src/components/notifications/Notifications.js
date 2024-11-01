// Trong components/notifications/Notifications.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markNotificationRead } from '../../actions/notification';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Button,
  Divider,
  CircularProgress,
  Box 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1)
  },
  header: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  notificationItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  noNotifications: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2)
  }
}));

const Notifications = ({ onClose, onNotificationRead }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification || { notifications: [], loading: true });
  
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    // Hiển thị tất cả thông báo, không lọc
    setFilteredNotifications(notifications);
  }, [notifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id));
      // Cập nhật trạng thái đã đọc trong danh sách local
      setFilteredNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <Box className={classes.loading}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.header}>
        Notifications
      </Typography>
      <List>
        {filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <React.Fragment key={notif._id}>
              <ListItem className={classes.notificationItem}>
                <ListItemText 
                  primary={notif.message}
                  secondary={new Date(notif.createdAt).toLocaleString()}
                />
                {!notif.read && (
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => handleMarkAsRead(notif._id)}
                  >
                    Mark as read
                  </Button>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography className={classes.noNotifications}>
            No notifications
          </Typography>
        )}
      </List>
    </div>
  );
};

export default Notifications;
