import React from 'react';
import Card from '../../components/UI/Card';
import { FiCreditCard, FiDollarSign } from 'react-icons/fi';

const Payments = ({ userRole }) => {
  // Only admin can see payments
  if (userRole !== 'admin') {
    return (
      <div className="no-access">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Payments & Subscriptions</h1>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>$1,245.99</h3>
            <p>Total Revenue</p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>
            <FiCreditCard />
          </div>
          <div className="stat-content">
            <h3>45</h3>
            <p>Active Subscriptions</p>
          </div>
        </Card>
      </div>

      <Card title="Recent Payments">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>$49.99</td>
                <td>2024-01-15</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>$19.99</td>
                <td>2024-01-10</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Payments;