import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import Classes from './pages/Classes/Classes';
import Reports from './pages/Reports/Reports';
import Forum from './pages/Forum/Forum';
import Messages from './pages/Messages/Messages';
import Payments from './pages/Payments/Payments';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import './App.css';

function App() {
  const isAuthenticated = true; // Replace with actual auth logic
  const userRole = 'admin'; // Replace with actual role

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/teachers" element={<Teachers />} />
                    <Route path="/classes" element={<Classes />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;