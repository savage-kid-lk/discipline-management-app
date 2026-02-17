import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiPlus, FiUsers } from 'react-icons/fi';

const Classes = ({ userRole }) => {
  const [classes] = useState([
    { id: 1, name: 'Mathematics 101', teacher: 'Mr. Smith', students: 25, schedule: 'Mon/Wed/Fri 9:00 AM' },
    { id: 2, name: 'Science Lab', teacher: 'Ms. Johnson', students: 30, schedule: 'Tue/Thu 1:00 PM' },
    { id: 3, name: 'History', teacher: 'Mr. Davis', students: 22, schedule: 'Mon/Wed 10:30 AM' },
  ]);

  return (
    <div className="classes-page">
      <div className="page-header">
        <h1 className="page-title">Class Management</h1>
        {userRole === 'admin' && (
          <button className="btn btn-primary"><FiPlus /> Add Class</button>
        )}
      </div>

      <div className="classes-grid">
        {classes.map(cls => (
          <Card key={cls.id} className="class-card">
            <div className="class-header">
              <h3>{cls.name}</h3>
            </div>
            <div className="class-info">
              <p><strong>Teacher:</strong> {cls.teacher}</p>
              <p><strong>Schedule:</strong> {cls.schedule}</p>
              <div className="stat">
                <FiUsers /> {cls.students} Students
              </div>
            </div>
            <div className="class-actions">
              <button className="btn btn-outline btn-sm">View Details</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Classes;