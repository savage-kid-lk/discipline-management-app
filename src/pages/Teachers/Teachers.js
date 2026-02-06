import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';

const Teachers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Mr. Smith', email: 'smith@school.edu', subject: 'Mathematics', status: 'Active' },
    { id: 2, name: 'Ms. Johnson', email: 'johnson@school.edu', subject: 'Science', status: 'Active' },
    { id: 3, name: 'Mr. Davis', email: 'davis@school.edu', subject: 'History', status: 'On Leave' },
  ]);

  const handleAddTeacher = () => {
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
      toast.success('Teacher deleted successfully');
    }
  };

  return (
    <div className="teachers-page">
      <div className="page-header">
        <h1 className="page-title">Teacher Management</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddTeacher}>
            <FiPlus /> Add Teacher
          </button>
        </div>
      </div>

      <Card>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Classes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>T{teacher.id.toString().padStart(3, '0')}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>3</td>
                  <td>
                    <span className={`badge ${teacher.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon">
                        <FiEye />
                      </button>
                      <button className="btn-icon">
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(teacher.id)} 
                        className="btn-icon danger"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Teacher"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
          toast.success('Teacher added successfully');
        }}>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" placeholder="Enter full name" required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label>Subject *</label>
            <input type="text" placeholder="Enter subject" required />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Teacher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;