import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// IMPORTANT: These imports must match the file structure exactly!
import Sidebar from './Sidebar';
import Header from './Header';
import '../../Styles/Layout.css'; 

const Layout = ({ userRole, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        userRole={userRole}
        onLogout={onLogout}
      />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header userRole={userRole} />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;