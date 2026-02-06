import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../Styles/Layout.css';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;