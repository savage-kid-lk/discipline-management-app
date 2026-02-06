import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiPlus, FiUsers, FiCalendar } from 'react-icons/fi';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';

const Classes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState([
    { id: 1, name: 'Mathematics 101', teacher: 'Mr. Smith', grade: '10', students: 25 },
    { id: 2, name: 'Science Lab', teacher: 'Ms. Johnson', grade: '9', students: 30 },
    { id: 3, name: 'History', teacher: 'Mr. Davis', grade: '11', students: 22 },
  ]);

  const handleAddClass = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="classes-page">
      <div className="page-header">
        <h1 className="page-title">Class Management</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddClass}>
            <FiPlus /> Add Class
          </button>
        </div>
      </div>

      <div className="classes-grid">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="class-card">
            <div className="class-header">
              <h3>{classItem.name}</h3>
              <span className="class-grade">Grade {classItem.grade}</span>
            </div>
            <div className="class-info">
              <p><strong>Teacher:</strong> {classItem.teacher}</p>
              <div className="class-stats">
                <div className="stat">
                  <FiUsers />
                  <span>{classItem.students} Students</span>
                </div>
                <div className="stat">
                  <FiCalendar />
                  <span>Mon, Wed, Fri</span>
                </div>
              </div>
            </div>
            <div className="class-actions">
              <button className="btn btn-outline">View Students</button>
              <button className="btn btn-primary">Manage</button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Class"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
          toast.success('Class added successfully');
        }}>
          <div className="form-group">
            <label>Class Name *</label>
            <input type="text" placeholder="e.g., Mathematics 101" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Grade Level *</label>
              <select required>
                <option value="">Select Grade</option>
                {[6,7,8,9,10,11,12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Max Students</label>
              <input type="number" placeholder="30" />
            </div>
          </div>
          <div className="form-group">
            <label>Schedule</label>
            <input type="text" placeholder="e.g., Mon, Wed, Fri 9:00-10:00" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;