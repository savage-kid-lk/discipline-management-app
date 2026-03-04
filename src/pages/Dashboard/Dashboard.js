import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import DashboardChart from '../../components/Charts/DashboardChart';
import ScheduleModal from '../../components/Modals/ScheduleModal';

import { 
  FiUsers, FiUser, FiBook, FiAlertTriangle, 
  FiMessageCircle, FiFileText, FiTrendingUp, 
  FiClock, FiCalendar, FiAward, FiBell, FiX
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Dashboard.css';

const Dashboard = ({ userRole = 'admin', user }) => {
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    students: { value: 0, change: '+12%', icon: <FiUsers />, color: 'primary' },
    teachers: { value: 0, change: '+4%', icon: <FiUser />, color: 'info' },
    classes: { value: 0, change: '+2%', icon: <FiBook />, color: 'success' },
    incidents: { value: 0, change: '-15%', icon: <FiAlertTriangle />, color: 'danger' }
  });
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'incident',
      title: 'New Incident Reported',
      message: 'Classroom disruption in Math class - Mr. Smith',
      time: '2 hours ago',
      read: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'Parent meeting request from Mrs. Davis',
      time: '5 hours ago',
      read: false,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Weekly Report Due',
      message: 'Submit weekly incident reports by Friday',
      time: '1 day ago',
      read: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentsSnap = await getDocs(collection(db, 'students'));
      const teachersSnap = await getDocs(collection(db, 'teachers'));
      const classesSnap = await getDocs(collection(db, 'classes'));
      const incidentsSnap = await getDocs(collection(db, 'incidents'));

      setStats({
        students: { 
          value: studentsSnap.size || 156, 
          change: '+12%', 
          icon: <FiUsers />, 
          color: 'primary' 
        },
        teachers: { 
          value: teachersSnap.size || 24, 
          change: '+4%', 
          icon: <FiUser />, 
          color: 'info' 
        },
        classes: { 
          value: classesSnap.size || 18, 
          change: '+2%', 
          icon: <FiBook />, 
          color: 'success' 
        },
        incidents: { 
          value: incidentsSnap.size || 8, 
          change: '-15%', 
          icon: <FiAlertTriangle />, 
          color: 'danger' 
        }
      });

      setRecentActivities([
        { id: 1, type: 'incident', title: 'New incident reported', description: 'Classroom disruption in Math class', time: '2 hours ago', user: 'Mr. Smith' },
        { id: 2, type: 'forum', title: 'New forum discussion', description: 'Teaching Strategies for 2024', time: '5 hours ago', user: 'Dr. Johnson' },
        { id: 3, type: 'message', title: 'Parent meeting request', description: 'Meeting with John\'s parents', time: '1 day ago', user: 'Mrs. Davis' },
        { id: 4, type: 'report', title: 'Weekly report generated', description: 'Incident summary for week 3', time: '1 day ago', user: 'System' },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  const handleViewSchedule = () => {
    setShowSchedule(true);
  };

  const handleCloseSchedule = () => {
    setShowSchedule(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { label: 'Create Report', icon: <FiFileText />, path: '/reports', color: 'danger' },
    { label: 'Add Student', icon: <FiUsers />, path: '/students', color: 'primary' },
    { label: 'Send Message', icon: <FiMessageCircle />, path: '/messages', color: 'info' },
    { label: 'View Analytics', icon: <FiTrendingUp />, path: '/reports', color: 'success' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>{getGreeting()}, {user?.email?.split('@')[0] || 'Admin'}!</h1>
          <p>Here's what's happening with your school today.</p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-outline" onClick={handleViewSchedule}>
            <FiCalendar /> View Schedule
          </button>
          <button 
            className="btn btn-primary notification-dashboard-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell /> Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge-dashboard">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Quick Notifications Panel */}
      {showNotifications && (
        <div className="quick-notifications-panel">
          <div className="quick-notifications-header">
            <h3>Recent Notifications</h3>
            <button className="close-btn" onClick={() => setShowNotifications(false)}>
              <FiX />
            </button>
          </div>
          <div className="quick-notifications-list">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className={`quick-notification-item ${!notif.read ? 'unread' : ''}`}>
                <div className="quick-notification-icon">
                  {notif.type === 'incident' && <FiAlertTriangle />}
                  {notif.type === 'message' && <FiMessageCircle />}
                  {notif.type === 'reminder' && <FiClock />}
                </div>
                <div className="quick-notification-content">
                  <p className="quick-notification-title">{notif.title}</p>
                  <p className="quick-notification-message">{notif.message}</p>
                  <span className="quick-notification-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="quick-notifications-footer">
            <button className="view-all-link" onClick={handleViewAllNotifications}>
              View all notifications
            </button>
            <button className="mark-read-link" onClick={handleMarkAsRead}>
              Mark all as read
            </button>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="stats-grid">
        {Object.entries(stats).map(([key, stat]) => (
          <Card key={key} className={`stat-card stat-card-${stat.color}`} onClick={() => navigate(`/${key}`)}>
            <div className="stat-icon-wrapper">
              {stat.icon}
            </div>
            <div className="stat-details">
              <span className="stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="stat-value-wrapper">
                <h3>{stat.value}</h3>
                <span className={`stat-change ${stat.change.startsWith('-') ? 'negative' : 'positive'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="dashboard-grid">
        <Card title="Incident Trends" className="chart-card">
          <div className="chart-container">
            <DashboardChart />
          </div>
        </Card>
        
        <Card title="Quick Actions" className="quick-actions-card">
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                className={`quick-action-btn quick-action-${action.color}`}
                onClick={() => navigate(action.path)}
              >
                <span className="quick-action-icon">{action.icon}</span>
                <span className="quick-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card title="Recent Activity" className="activity-card">
        <div className="activity-timeline">
          {recentActivities.map((activity, index) => (
            <div key={activity.id} className={`timeline-item timeline-${activity.type}`}>
              <div className="timeline-icon">
                {activity.type === 'incident' && <FiAlertTriangle />}
                {activity.type === 'forum' && <FiMessageCircle />}
                {activity.type === 'message' && <FiMessageCircle />}
                {activity.type === 'report' && <FiFileText />}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{activity.title}</h4>
                  <span className="timeline-time">
                    <FiClock /> {activity.time}
                  </span>
                </div>
                <p>{activity.description}</p>
                <span className="timeline-user">by {activity.user}</span>
              </div>
              {index < recentActivities.length - 1 && <div className="timeline-line"></div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule Modal */}
      <ScheduleModal isOpen={showSchedule} onClose={handleCloseSchedule} userRole={userRole} />
    </div>
  );
};

export default Dashboard;