import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import { FiPlus, FiDownload, FiFilter, FiEye, FiEdit, FiTrash2, FiSearch, FiX, FiChevronDown, FiUserCheck, FiUserX, FiAlertCircle } from 'react-icons/fi';
import Modal from '../../components/UI/Modal';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Students.css';

const Students = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    grade: '',
    status: '',
    incidents: ''
  });
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
    status: 'Active',
    incidents: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filters, students]);

  const fetchStudents = async () => {
    setLoading(true);
    const result = await getStudents();
    if (result.success) {
      setStudents(result.data);
      setFilteredStudents(result.data);
    } else {
      toast.error('Failed to load students');
    }
    setLoading(false);
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply grade filter
    if (filters.grade) {
      filtered = filtered.filter(student => student.grade === filters.grade);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(student => student.status === filters.status);
    }

    // Apply incidents filter
    if (filters.incidents) {
      const incidentCount = parseInt(filters.incidents);
      filtered = filtered.filter(student => (student.incidents || 0) >= incidentCount);
    }

    setFilteredStudents(filtered);
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
      status: 'Active',
      incidents: 0
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
      status: student.status || 'Active',
      incidents: student.incidents || 0
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

  const handleExport = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Grade', 'Parent', 'Parent Email', 'Status', 'Incidents'].join(','),
      ...filteredStudents.map(s => [
        s.studentId,
        s.name,
        s.grade,
        s.parentName,
        s.parentEmail,
        s.status,
        s.incidents || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Students exported successfully');
  };

  const clearFilters = () => {
    setFilters({
      grade: '',
      status: '',
      incidents: ''
    });
    setSearchTerm('');
    setIsFilterModalOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Active': return 'badge-success';
      case 'Inactive': return 'badge-secondary';
      case 'Suspended': return 'badge-danger';
      case 'Warning': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const getIncidentBadgeClass = (incidents) => {
    if (incidents >= 5) return 'badge-danger';
    if (incidents >= 3) return 'badge-warning';
    return 'badge-success';
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
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">Manage and monitor student records</p>
        </div>
        <div className="page-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FiX />
              </button>
            )}
          </div>
          <button className="btn btn-outline" onClick={() => setIsFilterModalOpen(true)}>
            <FiFilter /> Filter
            {(filters.grade || filters.status || filters.incidents) && (
              <span className="filter-badge">•</span>
            )}
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          {userRole === 'admin' && (
            <button className="btn btn-primary" onClick={handleAddStudent}>
              <FiPlus /> Add Student
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-small">
          <div className="stat-icon blue">
            <FiUserCheck />
          </div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'Active').length}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon orange">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'Warning').length}</h3>
            <p>On Warning</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon red">
            <FiUserX />
          </div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'Suspended').length}</h3>
            <p>Suspended</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon green">
            <FiUserCheck />
          </div>
          <div className="stat-content">
            <h3>{students.reduce((acc, s) => acc + (s.incidents || 0), 0)}</h3>
            <p>Total Incidents</p>
          </div>
        </div>
      </div>

      <Card className="students-table-card">
        <div className="table-header">
          <div className="table-title">
            <h3>Student Records</h3>
            <span className="record-count">{filteredStudents.length} students</span>
          </div>
          <div className="table-actions">
            <select className="table-select" onChange={(e) => console.log('Sort by:', e.target.value)}>
              <option value="">Sort by</option>
              <option value="name">Name</option>
              <option value="grade">Grade</option>
              <option value="status">Status</option>
              <option value="incidents">Incidents</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Parent/Guardian</th>
                <th>Parent Email</th>
                <th>Incidents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="no-data-content">
                      <FiUserX size={48} />
                      <h3>No students found</h3>
                      <p>Try adjusting your filters or add a new student</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td><span className="student-id">{student.studentId}</span></td>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {student.name?.charAt(0) || '?'}
                        </div>
                        {student.name}
                      </div>
                    </td>
                    <td><span className="grade-badge">Grade {student.grade}</span></td>
                    <td>{student.parentName}</td>
                    <td><a href={`mailto:${student.parentEmail}`} className="email-link">{student.parentEmail}</a></td>
                    <td>
                      <span className={`badge ${getIncidentBadgeClass(student.incidents || 0)}`}>
                        {student.incidents || 0} incidents
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => toast.info('View student details')} title="View">
                          <FiEye />
                        </button>
                        {userRole === 'admin' && (
                          <>
                            <button className="btn-icon" onClick={() => handleEditStudent(student)} title="Edit">
                              <FiEdit />
                            </button>
                            <button className="btn-icon danger" onClick={() => handleDeleteStudent(student.id)} title="Delete">
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Students"
        size="md"
      >
        <div className="filter-form">
          <div className="form-group">
            <label>Grade</label>
            <select 
              value={filters.grade}
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="">All Grades</option>
              {[9,10,11,12].map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Warning">Warning</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="form-group">
            <label>Minimum Incidents</label>
            <select 
              value={filters.incidents}
              onChange={(e) => setFilters({...filters, incidents: e.target.value})}
            >
              <option value="">Any</option>
              <option value="1">1+ incidents</option>
              <option value="3">3+ incidents</option>
              <option value="5">5+ incidents</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn btn-outline" onClick={clearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={() => setIsFilterModalOpen(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>

      {/* Student Form Modal */}
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

          <div className="form-row">
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
            <div className="form-group">
              <label>Incident Count</label>
              <input 
                type="number"
                name="incidents"
                value={formData.incidents}
                onChange={handleInputChange}
                min="0"
              />
            </div>
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