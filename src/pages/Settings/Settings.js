import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiSave, FiBell, FiShield, FiUser, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    aiIntegration: true,
    autoSave: true,
    language: 'en',
    timezone: 'UTC-5',
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

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
                onChange={() => handleToggle('emailNotifications')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <h4>Push Notifications</h4>
              <p>Receive browser notifications for urgent matters</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <h4>Weekly Reports</h4>
              <p>Receive weekly summary reports via email</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.weeklyReports}
                onChange={() => handleToggle('weeklyReports')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </Card>

        <Card title="AI Integration" icon={<FiShield />}>
          <div className="setting-item">
            <div>
              <h4>AI Assistant</h4>
              <p>Enable AI-powered suggestions for incident resolution</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.aiIntegration}
                onChange={() => handleToggle('aiIntegration')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-description">
            <p>When enabled, the AI will analyze incident reports and provide step-by-step solutions based on similar past cases.</p>
          </div>
        </Card>

        <Card title="Account Settings" icon={<FiUser />}>
          <div className="form-group">
            <label>Display Name</label>
            <input type="text" defaultValue="Admin User" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" defaultValue="admin@edumanage.edu" />
          </div>
          <div className="form-group">
            <label>Change Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
        </Card>

        <Card title="System Preferences" icon={<FiGlobe />}>
          <div className="form-group">
            <label>Language</label>
            <select value={settings.language} onChange={(e) => setSettings({...settings, language: e.target.value})}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select value={settings.timezone} onChange={(e) => setSettings({...settings, timezone: e.target.value})}>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC+0">GMT (UTC+0)</option>
            </select>
          </div>
          <div className="setting-item">
            <div>
              <h4>Auto-save Reports</h4>
              <p>Automatically save report drafts every 5 minutes</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.autoSave}
                onChange={() => handleToggle('autoSave')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;