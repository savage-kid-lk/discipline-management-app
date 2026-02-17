import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import { FiPlus, FiDownload, FiFilter, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Modal from '../../components/UI/Modal';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Students.css';

const Students = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    grade: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    dateOfBirth: '',
    address: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const result = await getStudents();
    if (result.success) {
      setStudents(result.data);
    } else {
      toast.error('Failed to load students');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddStudent = () => {
    if (userRole !== 'admin') {
      toast.error('Only admins can add students');
      return;
    }
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      studentId: '',
      grade: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      dateOfBirth: '',
      address: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    if (userRole !== 'admin') {
      toast.error('Only admins can edit students');
      return;
    }
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      studentId: student.studentId || '',
      grade: student.grade || '',
      parentName: student.parentName || '',
      parentEmail: student.parentEmail || '',
      parentPhone: student.parentPhone || '',
      dateOfBirth: student.dateOfBirth || '',
      address: student.address || '',
      status: student.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (id) => {
    if (userRole !== 'admin') {
      toast.error('Only admins can delete students');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this student?')) {
      const result = await deleteStudent(id);
      if (result.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
      } else {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const studentData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      updatedAt: new Date().toISOString()
    };

    let result;
    if (editingStudent) {
      result = await updateStudent(editingStudent.id, studentData);
    } else {
      result = await addStudent(studentData);
    }

    if (result.success) {
      toast.success(editingStudent ? 'Student updated successfully' : 'Student added successfully');
      setIsModalOpen(false);
      fetchStudents();
    } else {
      toast.error(result.error || 'Operation failed');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="students-page">
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <div className="page-actions">
          <button className="btn btn-outline"><FiFilter /> Filter</button>
          <button className="btn btn-outline"><FiDownload /> Export</button>
          {userRole === 'admin' && (
            <button className="btn btn-primary" onClick={handleAddStudent}>
              <FiPlus /> Add Student
            </button>
          )}
        </div>
      </div>

      <Card>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Parent</th>
                <th>Parent Email</th>
                <th>Incidents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.grade}</td>
                  <td>{student.parentName}</td>
                  <td>{student.parentEmail}</td>
                  <td>
                    <span className={`badge ${student.incidents > 2 ? 'badge-danger' : 'badge-warning'}`}>
                      {student.incidents || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => toast.info('View student details')}>
                        <FiEye />
                      </button>
                      {userRole === 'admin' && (
                        <>
                          <button className="btn-icon" onClick={() => handleEditStudent(student)}>
                            <FiEdit />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDeleteStudent(student.id)}>
                            <FiTrash2 />
                          </button>
                        </>
                      )}
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
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required 
                placeholder="John" 
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required 
                placeholder="Doe" 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Student ID *</label>
              <input 
                type="text" 
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required 
                placeholder="S001" 
              />
            </div>
            <div className="form-group">
              <label>Grade *</label>
              <select 
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Grade</option>
                {[9,10,11,12].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h4>Parent/Guardian Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Parent Name *</label>
                <input 
                  type="text" 
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required 
                  placeholder="Jane Doe" 
                />
              </div>
              <div className="form-group">
                <label>Parent Email *</label>
                <input 
                  type="email" 
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  required 
                  placeholder="parent@example.com" 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Parent Phone</label>
                <input 
                  type="tel" 
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890" 
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              placeholder="123 Main St, City, State" 
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Warning">Warning</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;