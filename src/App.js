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
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Styles/theme.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // You can fetch user role from Firestore here
        setUserRole('admin'); // Default for now
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
              <Layout userRole={userRole} onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard userRole={userRole} user={user} />} />
          <Route path="students" element={<Students userRole={userRole} />} />
          <Route path="teachers" element={<Teachers userRole={userRole} />} />
          <Route path="classes" element={<Classes userRole={userRole} />} />
          <Route path="reports" element={<Reports userRole={userRole} />} />
          <Route path="forum" element={<Forum userRole={userRole} />} />
          <Route path="messages" element={<Messages userRole={userRole} />} />
          <Route path="payments" element={<Payments userRole={userRole} />} />
          <Route path="settings" element={<Settings userRole={userRole} />} />
        </Route>
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;