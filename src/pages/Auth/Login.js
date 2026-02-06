import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI } from '../../api/auth';
import '../../Styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API Call
      const data = await authAPI.login(formData);
      
      // Store Token & User Info
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success(`Welcome back, ${data.user.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>EduManage</h1>
          <p>Student Management System</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <FiMail />
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <FiLock />
              <input 
                type="password" 
                placeholder="Enter your password" 
                required 
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
            {isLoading ? <FiLoader className="spin" /> : 'Sign In'}
          </button>

          <div className="auth-footer">
            <p>Authorized personnel only</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;