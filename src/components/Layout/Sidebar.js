import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiUser, FiBook, FiFileText, 
  FiMessageSquare, FiMail, FiCreditCard, FiSettings, 
  FiChevronLeft, FiChevronRight, FiLogOut,
  FiBarChart2, FiCalendar, FiBell, FiHelpCircle
} from 'react-icons/fi';
import '../../Styles/Sidebar.css';

const Sidebar = ({ collapsed, onToggle, userRole = 'admin', onLogout }) => {
  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard', roles: ['admin', 'teacher', 'principal', 'parent'] },
    { path: '/students', icon: <FiUsers />, label: 'Students', roles: ['admin'] },
    { path: '/teachers', icon: <FiUser />, label: 'Teachers', roles: ['admin'] },
    { path: '/classes', icon: <FiBook />, label: 'Classes', roles: ['admin', 'teacher', 'principal'] },
    { path: '/reports', icon: <FiFileText />, label: 'Reports', roles: ['admin', 'teacher', 'principal', 'parent'] },
    { path: '/forum', icon: <FiMessageSquare />, label: 'Forum', roles: ['admin', 'teacher', 'principal', 'parent'] },
    { path: '/messages', icon: <FiMail />, label: 'Messages', roles: ['admin', 'teacher', 'principal', 'parent'] },
    { path: '/payments', icon: <FiCreditCard />, label: 'Payments', roles: ['admin'] },
    { path: '/settings', icon: <FiSettings />, label: 'Settings', roles: ['admin', 'teacher', 'principal', 'parent'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="logo-container">
            <div className="logo-icon">📚</div>
            <h2>EduManage</h2>
          </div>
        )}
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      
      <div className="sidebar-nav-container">
        <nav className="sidebar-nav">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && <span className="nav-indicator"></span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <div className="sidebar-footer-top">
          <button onClick={onLogout} className="nav-item logout-btn">
            <span className="nav-icon"><FiLogOut /></span>
            {!collapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>

        {!collapsed && (
          <div className="user-profile">
            <div className="user-avatar">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">
                {userRole === 'admin' ? 'Administrator' :
                 userRole === 'teacher' ? 'Teacher' :
                 userRole === 'principal' ? 'Principal' : 'Parent'}
              </p>
              <p className="user-role-badge">{userRole.toUpperCase()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;