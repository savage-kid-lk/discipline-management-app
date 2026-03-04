import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { FiPlus, FiDownload, FiFilter, FiEye, FiEdit, FiTrash2, FiSearch, FiX, FiUser, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../Styles/Teachers.css';

const Teachers = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    status: '',
    experience: ''
  });
  
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Mr. Smith', email: 'smith@school.edu', subject: 'Mathematics', status: 'Active', experience: '8 years', phone: '(555) 123-4567', students: 25, rating: 4.8 },
    { id: 2, name: 'Ms. Johnson', email: 'johnson@school.edu', subject: 'Science', status: 'Active', experience: '5 years', phone: '(555) 234-5678', students: 30, rating: 4.9 },
    { id: 3, name: 'Mr. Davis', email: 'davis@school.edu', subject: 'History', status: 'On Leave', experience: '12 years', phone: '(555) 345-6789', students: 22, rating: 4.7 },
    { id: 4, name: 'Mrs. Wilson', email: 'wilson@school.edu', subject: 'English', status: 'Active', experience: '6 years', phone: '(555) 456-7890', students: 28, rating: 4.6 },
    { id: 5, name: 'Ms. Garcia', email: 'garcia@school.edu', subject: 'Art', status: 'Active', experience: '3 years', phone: '(555) 567-8901', students: 20, rating: 4.5 },
  ]);

  const [filteredTeachers, setFilteredTeachers] = useState(teachers);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterTeachers(term, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    filterTeachers(searchTerm, newFilters);
  };

  const filterTeachers = (search, filterParams) => {
    let filtered = [...teachers];

    // Apply search
    if (search) {
      filtered = filtered.filter(teacher => 
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.email.toLowerCase().includes(search.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply subject filter
    if (filterParams.subject) {
      filtered = filtered.filter(teacher => teacher.subject === filterParams.subject);
    }

    // Apply status filter
    if (filterParams.status) {
      filtered = filtered.filter(teacher => teacher.status === filterParams.status);
    }

    // Apply experience filter
    if (filterParams.experience) {
      const expYears = parseInt(filterParams.experience);
      filtered = filtered.filter(teacher => {
        const teacherExp = parseInt(teacher.experience);
        return teacherExp >= expYears;
      });
    }

    setFilteredTeachers(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Status', 'Experience', 'Phone', 'Students', 'Rating'].join(','),
      ...filteredTeachers.map(t => [
        t.name,
        t.email,
        t.subject,
        t.status,
        t.experience,
        t.phone,
        t.students,
        t.rating
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Teachers exported successfully');
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      status: '',
      experience: ''
    });
    setSearchTerm('');
    filterTeachers('', { subject: '', status: '', experience: '' });
    setIsFilterModalOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Active': return 'badge-success';
      case 'On Leave': return 'badge-warning';
      case 'Inactive': return 'badge-secondary';
      default: return 'badge-info';
    }
  };

  const subjects = ['Mathematics', 'Science', 'History', 'English', 'Art', 'Physical Education', 'Music', 'Computer Science'];

  return (
    <div className="teachers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Management</h1>
          <p className="page-subtitle">Manage teacher profiles and assignments</p>
        </div>
        <div className="page-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => handleSearch({ target: { value: '' } })}>
                <FiX />
              </button>
            )}
          </div>
          <button className="btn btn-outline" onClick={() => setIsFilterModalOpen(true)}>
            <FiFilter /> Filter
            {(filters.subject || filters.status || filters.experience) && (
              <span className="filter-badge">•</span>
            )}
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          {userRole === 'admin' && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <FiPlus /> Add Teacher
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-small">
          <div className="stat-icon blue">
            <FiUser />
          </div>
          <div className="stat-content">
            <h3>{teachers.length}</h3>
            <p>Total Teachers</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon green">
            <FiUser />
          </div>
          <div className="stat-content">
            <h3>{teachers.filter(t => t.status === 'Active').length}</h3>
            <p>Active Teachers</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon orange">
            <FiBook />
          </div>
          <div className="stat-content">
            <h3>{subjects.length}</h3>
            <p>Subjects</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon purple">
            <FiUser />
          </div>
          <div className="stat-content">
            <h3>{teachers.reduce((acc, t) => acc + t.students, 0)}</h3>
            <p>Total Students</p>
          </div>
        </div>
      </div>

      <Card className="teachers-table-card">
        <div className="table-header">
          <div className="table-title">
            <h3>Teacher Directory</h3>
            <span className="record-count">{filteredTeachers.length} teachers</span>
          </div>
        </div>

        <div className="teachers-grid">
          {filteredTeachers.length === 0 ? (
            <div className="no-data">
              <div className="no-data-content">
                <FiUser size={48} />
                <h3>No teachers found</h3>
                <p>Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            filteredTeachers.map(teacher => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-card-header">
                  <div className="teacher-avatar">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <p>{teacher.subject}</p>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(teacher.status)}`}>
                    {teacher.status}
                  </span>
                </div>
                
                <div className="teacher-details">
                  <div className="detail-item">
                    <FiMail />
                    <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                  </div>
                  <div className="detail-item">
                    <FiPhone />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="detail-item">
                    <FiBook />
                    <span>{teacher.experience} experience</span>
                  </div>
                </div>

                <div className="teacher-stats">
                  <div className="stat">
                    <span className="stat-value">{teacher.students}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{teacher.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>

                <div className="teacher-actions">
                  <button className="btn-icon" onClick={() => toast.info('View teacher details')}>
                    <FiEye />
                  </button>
                  {userRole === 'admin' && (
                    <>
                      <button className="btn-icon" onClick={() => toast.info('Edit teacher')}>
                        <FiEdit />
                      </button>
                      <button className="btn-icon danger" onClick={() => toast.error('Delete teacher')}>
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Teachers"
        size="md"
      >
        <div className="filter-form">
          <div className="form-group">
            <label>Subject</label>
            <select 
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Minimum Experience</label>
            <select 
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <option value="">Any</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
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

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Teacher"
        size="lg"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          toast.success('Teacher added successfully');
          setIsModalOpen(false);
        }} className="teacher-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" required placeholder="John Smith" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" required placeholder="teacher@school.edu" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <select required>
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="(555) 123-4567" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience</label>
              <input type="text" placeholder="e.g., 5 years" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
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