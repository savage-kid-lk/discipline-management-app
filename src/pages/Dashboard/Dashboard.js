import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import DashboardChart from '../../components/Charts/DashboardChart';
import { 
  FiUsers, FiUser, FiBook, FiAlertTriangle, 
  FiMessageCircle, FiFileText, FiTrendingUp, 
  FiClock, FiCalendar, FiAward, FiBell 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Dashboard.css';

const Dashboard = ({ userRole = 'admin', user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: { value: 0, change: '+0%', icon: <FiUsers />, color: 'primary' },
    teachers: { value: 0, change: '+0%', icon: <FiUser />, color: 'info' },
    classes: { value: 0, change: '+0%', icon: <FiBook />, color: 'success' },
    incidents: { value: 0, change: '0%', icon: <FiAlertTriangle />, color: 'danger' }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from Firestore
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

      // Mock recent activities (replace with real data)
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
          <button className="btn btn-outline">
            <FiCalendar /> View Schedule
          </button>
          <button className="btn btn-primary">
            <FiBell /> Notifications
          </button>
        </div>
      </div>
      
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
    </div>
  );
};

export default Dashboard;