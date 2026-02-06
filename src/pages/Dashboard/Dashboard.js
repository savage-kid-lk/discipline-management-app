import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import { FiUsers, FiUser, FiBook, FiAlertTriangle, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import DashboardChart from '../../components/Charts/DashboardChart';
import { dashboardAPI } from '../../api/dashboard';
import toast from 'react-hot-toast';
import '../../Styles/Dashboard.css';

const Dashboard = ({ userRole }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: { value: 0, change: '0%', trending: 'up' },
    teachers: { value: 0, change: '0%', trending: 'up' },
    classes: { value: 0, change: '0%', trending: 'up' },
    incidents: { value: 0, change: '0%', trending: 'down' }
  });
  const [recentIncidents, setRecentIncidents] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, incidentsData] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentIncidents()
        ]);
        
        setStats(statsData);
        setRecentIncidents(incidentsData);
      } catch (error) {
        console.error('Dashboard load failed', error);
        toast.error('Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  const statCards = [
    { title: 'Total Students', data: stats.students, icon: <FiUsers /> },
    { title: 'Active Teachers', data: stats.teachers, icon: <FiUser /> },
    { title: 'Classes', data: stats.classes, icon: <FiBook /> },
    { title: 'Incidents This Month', data: stats.incidents, icon: <FiAlertTriangle /> },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.data.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className={`stat-change ${stat.data.trending}`}>
              {stat.data.trending === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{stat.data.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-row">
        <Card title="Incident Trends" className="chart-card">
          <DashboardChart /> 
          {/* Note: DashboardChart component needs to be updated to accept props if you want dynamic data there too */}
        </Card>
        <Card title="Recent Incidents" className="recent-incidents">
          <div className="incidents-list">
            {recentIncidents.length === 0 ? <p>No recent incidents.</p> : recentIncidents.map((incident) => (
              <div key={incident.id} className="incident-item">
                <div>
                  <h4>{incident.studentName}</h4>
                  <p className="incident-type">{incident.type}</p>
                </div>
                <div className="incident-meta">
                  <span className={`badge severity-${incident.severity.toLowerCase()}`}>
                    {incident.severity}
                  </span>
                  <span className="date">{new Date(incident.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;