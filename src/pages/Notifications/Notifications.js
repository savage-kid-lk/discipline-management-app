import React from 'react';
import Card from '../../components/UI/Card';
import { FiBell, FiAlertTriangle, FiMessageCircle, FiClock, FiCheck, FiTrash2 } from 'react-icons/fi';
import '../../Styles/Notifications.css';

const Notifications = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'incident': return <FiAlertTriangle />;
      case 'message': return <FiMessageCircle />;
      case 'reminder': return <FiClock />;
      default: return <FiBell />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={onMarkAllAsRead}>
            <FiCheck /> Mark All as Read
          </button>
        </div>
      </div>

      <Card>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <FiBell size={48} />
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-item-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-item-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-item-time">
                    {getTimeAgo(notification.timestamp)}
                  </span>
                </div>
                <div className="notification-item-actions">
                  {!notification.read && (
                    <button 
                      className="btn-icon"
                      onClick={() => onMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <FiCheck />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;