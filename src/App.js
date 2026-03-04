import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import Classes from './pages/Classes/Classes';
import Reports from './pages/Reports/Reports';
import Forum from './pages/Forum/Forum';
import Messages from './pages/Messages/Messages';
import Payments from './pages/Payments/Payments';
import Settings from './pages/Settings/Settings';
import Notifications from './pages/Notifications/Notifications';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Styles/theme.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        setUserRole('admin');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData, role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
        </div>
      );
    }
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--dark)',
            color: 'var(--white)',
            borderRadius: 'var(--radius)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--white)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger)',
              secondary: 'var(--white)',
            },
          },
        }}
      />
      
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" />
          } 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout 
                userRole={userRole} 
                onLogout={handleLogout} 
                user={user}
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={
            <Dashboard 
              userRole={userRole} 
              user={user}
              notifications={notifications}
              onMarkAsRead={handleMarkAllAsRead}
            />
          } />
          <Route path="students" element={<Students userRole={userRole} />} />
          <Route path="teachers" element={<Teachers userRole={userRole} />} />
          <Route path="classes" element={<Classes userRole={userRole} />} />
          <Route path="reports" element={<Reports userRole={userRole} />} />
          <Route path="forum" element={<Forum userRole={userRole} />} />
          <Route path="messages" element={<Messages userRole={userRole} />} />
          <Route path="payments" element={<Payments userRole={userRole} />} />
          <Route path="settings" element={<Settings userRole={userRole} />} />
          <Route path="notifications" element={
            <Notifications 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          } />
        </Route>
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;