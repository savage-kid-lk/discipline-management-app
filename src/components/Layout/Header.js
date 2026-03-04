import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiSearch, FiClock, FiAlertTriangle, FiMessageCircle, FiUser, FiCheck } from 'react-icons/fi';
import '../../Styles/Header.css';

const Header = ({ userRole, notifications = [], onMarkAsRead, onViewAll }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search students, reports, messages..." />
        </div>
      </div>
      <div className="header-right">
        <div className="notification-container" ref={notificationRef}>
          <button 
            className={`icon-btn notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button className="mark-all-read" onClick={onMarkAsRead}>
                  <FiCheck /> Mark all as read
                </button>
              </div>
              
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    <FiBell size={24} />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((notif, index) => (
                      <div key={index} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                        <div className="notification-icon">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="notification-content">
                          <p className="notification-title">{notif.title}</p>
                          <p className="notification-message">{notif.message}</p>
                          <span className="notification-time">
                            {getTimeAgo(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              
              <div className="notification-footer">
                <button className="view-all-btn" onClick={onViewAll}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="user-dropdown">
          <button className="user-btn">
            <div className="avatar-sm">
              {userRole?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="user-name">{userRole || 'User'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;