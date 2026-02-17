import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiSave, FiBell, FiUser, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = ({ userRole }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: 'en',
    timezone: 'UTC-5',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="settings-grid">
        <Card title="Notification Settings" icon={<FiBell />}>
          <div className="setting-item">
            <div>
              <h4>Email Notifications</h4>
              <p>Receive email updates about incidents and reports</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <h4>Push Notifications</h4>
              <p>Receive browser notifications</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>
        </Card>

        <Card title="Account Settings" icon={<FiUser />}>
          <div className="form-group">
            <label>Display Name</label>
            <input type="text" defaultValue="Admin User" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="admin@edumanage.com" />
          </div>
        </Card>

        <Card title="Preferences" icon={<FiGlobe />}>
          <div className="form-group">
            <label>Language</label>
            <select value={settings.language} onChange={(e) => setSettings({...settings, language: e.target.value})}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select value={settings.timezone} onChange={(e) => setSettings({...settings, timezone: e.target.value})}>
              <option value="UTC-5">Eastern Time</option>
              <option value="UTC-8">Pacific Time</option>
            </select>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;