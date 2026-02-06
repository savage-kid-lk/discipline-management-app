import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiCreditCard, FiCheckCircle, FiXCircle, FiDownload } from 'react-icons/fi';

const Payments = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, user: 'John Doe (Parent)', plan: 'Premium', amount: '$49.99', status: 'Active', nextBilling: '2024-02-15' },
    { id: 2, user: 'Jane Smith (Parent)', plan: 'Basic', amount: '$19.99', status: 'Active', nextBilling: '2024-02-10' },
    { id: 3, user: 'ABC School', plan: 'Enterprise', amount: '$299.99', status: 'Pending', nextBilling: '2024-02-01' },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, user: 'John Doe', amount: '$49.99', date: '2024-01-15', method: 'Credit Card', status: 'Completed' },
    { id: 2, user: 'Jane Smith', amount: '$19.99', date: '2024-01-10', method: 'PayPal', status: 'Completed' },
    { id: 3, user: 'ABC School', amount: '$299.99', date: '2024-01-05', method: 'Bank Transfer', status: 'Pending' },
  ]);

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Payments & Subscriptions</h1>
      </div>

      <div className="payments-stats">
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>$1,245.99</h3>
            <p>Total Revenue</p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
            <FiCreditCard />
          </div>
          <div className="stat-content">
            <h3>45</h3>
            <p>Active Subscriptions</p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>32</h3>
            <p>Completed Payments</p>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ef4444' }}>
            <FiXCircle />
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Pending Payments</p>
          </div>
        </Card>
      </div>

      <div className="payments-section">
        <Card title="Active Subscriptions">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Subscription ID</th>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Next Billing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>SUB-{sub.id.toString().padStart(3, '0')}</td>
                    <td>{sub.user}</td>
                    <td>
                      <span className={`badge ${sub.plan === 'Premium' ? 'badge-success' : 'badge-info'}`}>
                        {sub.plan}
                      </span>
                    </td>
                    <td>{sub.amount}</td>
                    <td>
                      <span className={`badge ${sub.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>{sub.nextBilling}</td>
                    <td>
                      <button className="btn-icon">
                        <FiDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="payments-section">
        <Card title="Recent Payments">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>PAY-{payment.id.toString().padStart(3, '0')}</td>
                    <td>{payment.user}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.date}</td>
                    <td>{payment.method}</td>
                    <td>
                      <span className={`badge ${payment.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Payments;