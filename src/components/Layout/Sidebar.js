import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiBook, 
  FiFileText, 
  FiMessageSquare,
  FiMail, 
  FiCreditCard,
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import '../../Styles/Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const navItems = [
    { path: '/dashboard', icon: <AiOutlineDashboard />, label: 'Dashboard' },
    { path: '/students', icon: <FiUsers />, label: 'Students' },
    { path: '/teachers', icon: <FiUser />, label: 'Teachers' },
    { path: '/classes', icon: <FiBook />, label: 'Classes' },
    { path: '/reports', icon: <FiFileText />, label: 'Incident Reports' },
    { path: '/forum', icon: <FiMessageSquare />, label: 'Forum' },
    { path: '/messages', icon: <FiMail />, label: 'Messages' },
    { path: '/payments', icon: <FiCreditCard />, label: 'Payments' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>EduManage</h2>}
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <div className="avatar">AD</div>
            <div>
              <p className="username">Admin User</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;