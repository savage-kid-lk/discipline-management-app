import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../Styles/Layout.css'; 

const Layout = ({ userRole, onLogout, user, notifications, onMarkAllAsRead }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleViewAllNotifications = () => {
    navigate('/notifications');
  };

  return (
    <div className="layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        userRole={userRole}
        onLogout={onLogout}
      />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header 
          userRole={userRole} 
          notifications={notifications}
          onMarkAsRead={onMarkAllAsRead}
          onViewAll={handleViewAllNotifications}
        />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;