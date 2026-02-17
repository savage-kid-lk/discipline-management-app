import React from 'react';
import { FiBell, FiSearch } from 'react-icons/fi';
import '../../Styles/Header.css';

const Header = ({ userRole }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-dropdown">
          <button className="user-btn">
            <div className="avatar-sm">
              {userRole?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>{userRole || 'User'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;