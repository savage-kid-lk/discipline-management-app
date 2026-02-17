import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiLoader } from 'react-icons/fi';
import { loginWithEmail } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Auth.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Map email to role
  const getRoleFromEmail = (email) => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('teacher')) return 'teacher';
    if (email.includes('principal')) return 'principal';
    if (email.includes('parent')) return 'parent';
    return 'user';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email domain
    const validEmails = [
      'admin@edumanage.com',
      'teacher@edumanage.com',
      'principal@edumanage.com',
      'parent@edumanage.com'
    ];

    if (!validEmails.includes(formData.email)) {
      toast.error('Please use one of the authorized emails');
      setIsLoading(false);
      return;
    }

    const result = await loginWithEmail(formData.email, formData.password);
    
    if (result.success) {
      const role = getRoleFromEmail(formData.email);
      onLogin(result.user, role);
      toast.success(`Welcome back, ${role}!`);
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>EduManage</h1>
          <p>Discipline Management System</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="info-box">
            <p><strong>Demo Credentials:</strong></p>
            <p>admin@edumanage.com</p>
            <p>teacher@edumanage.com</p>
            <p>parent@edumanage.com</p>
            <p><small>Password: password123</small></p>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <FiMail />
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <FiLock />
              <input 
                type="password" 
                name="password"
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
            {isLoading ? <FiLoader className="spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;