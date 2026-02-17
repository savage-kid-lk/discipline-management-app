import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiPlus } from 'react-icons/fi';

const Teachers = ({ userRole }) => {
  const [teachers] = useState([
    { id: 1, name: 'Mr. Smith', email: 'smith@school.edu', subject: 'Mathematics', status: 'Active' },
    { id: 2, name: 'Ms. Johnson', email: 'johnson@school.edu', subject: 'Science', status: 'Active' },
    { id: 3, name: 'Mr. Davis', email: 'davis@school.edu', subject: 'History', status: 'On Leave' },
  ]);

  return (
    <div className="teachers-page">
      <div className="page-header">
        <h1 className="page-title">Teacher Management</h1>
        {userRole === 'admin' && (
          <button className="btn btn-primary"><FiPlus /> Add Teacher</button>
        )}
      </div>

      <Card>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>
                    <span className={`badge ${teacher.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {teacher.status}
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
  );
};

export default Teachers;