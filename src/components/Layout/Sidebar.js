import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiUser, FiBook, FiFileText, 
  FiMessageSquare, FiMail, FiCreditCard, FiSettings, 
  FiChevronLeft, FiChevronRight, FiLogOut 
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
        {!collapsed && <h2>EduManage</h2>}
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {filteredNavItems.map((item) => (
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
        {/* Logout Button */}
        <button onClick={onLogout} className="nav-item" style={{width: '100%', border: 'none', background: 'none', cursor: 'pointer'}}>
             <FiLogOut />
             {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <div className="user-info" style={{marginTop: '10px'}}>
            <div className="avatar">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="username">
                {userRole === 'admin' ? 'Administrator' :
                 userRole === 'teacher' ? 'Teacher' :
                 userRole === 'principal' ? 'Principal' : 'Parent'}
              </p>
              <p className="user-role">{userRole.toUpperCase()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;