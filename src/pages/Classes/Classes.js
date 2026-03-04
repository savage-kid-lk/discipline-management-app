import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { FiPlus, FiDownload, FiFilter, FiEye, FiEdit, FiTrash2, FiSearch, FiX, FiUsers, FiClock, FiUser, FiBook, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../Styles/Classes.css';

const Classes = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    teacher: '',
    grade: '',
    status: ''
  });

  const [classes, setClasses] = useState([
    { id: 1, name: 'Mathematics 101', teacher: 'Mr. Smith', teacherId: 1, students: 25, schedule: 'Mon/Wed/Fri 9:00 AM', room: '101', grade: '10', status: 'Active' },
    { id: 2, name: 'Science Lab', teacher: 'Ms. Johnson', teacherId: 2, students: 30, schedule: 'Tue/Thu 1:00 PM', room: 'Lab 1', grade: '9', status: 'Active' },
    { id: 3, name: 'History', teacher: 'Mr. Davis', teacherId: 3, students: 22, schedule: 'Mon/Wed 10:30 AM', room: '105', grade: '11', status: 'Active' },
    { id: 4, name: 'English Literature', teacher: 'Mrs. Wilson', teacherId: 4, students: 28, schedule: 'Tue/Thu 9:00 AM', room: '102', grade: '10', status: 'Active' },
    { id: 5, name: 'Physics', teacher: 'Ms. Johnson', teacherId: 2, students: 20, schedule: 'Wed/Fri 1:00 PM', room: 'Lab 2', grade: '11', status: 'Inactive' },
  ]);

  const [filteredClasses, setFilteredClasses] = useState(classes);

  const teachers = ['Mr. Smith', 'Ms. Johnson', 'Mr. Davis', 'Mrs. Wilson'];
  const grades = ['9', '10', '11', '12'];

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterClasses(term, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    filterClasses(searchTerm, newFilters);
  };

  const filterClasses = (search, filterParams) => {
    let filtered = [...classes];

    if (search) {
      filtered = filtered.filter(cls => 
        cls.name.toLowerCase().includes(search.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(search.toLowerCase()) ||
        cls.room.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterParams.teacher) {
      filtered = filtered.filter(cls => cls.teacher === filterParams.teacher);
    }

    if (filterParams.grade) {
      filtered = filtered.filter(cls => cls.grade === filterParams.grade);
    }

    if (filterParams.status) {
      filtered = filtered.filter(cls => cls.status === filterParams.status);
    }

    setFilteredClasses(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Class Name', 'Teacher', 'Grade', 'Students', 'Schedule', 'Room', 'Status'].join(','),
      ...filteredClasses.map(c => [
        c.name,
        c.teacher,
        c.grade,
        c.students,
        c.schedule,
        c.room,
        c.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classes_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Classes exported successfully');
  };

  const clearFilters = () => {
    setFilters({
      teacher: '',
      grade: '',
      status: ''
    });
    setSearchTerm('');
    filterClasses('', { teacher: '', grade: '', status: '' });
    setIsFilterModalOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Active' ? 'badge-success' : 'badge-secondary';
  };

  return (
    <div className="classes-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Management</h1>
          <p className="page-subtitle">Manage classes, schedules, and assignments</p>
        </div>
        <div className="page-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search classes..." 
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
            {(filters.teacher || filters.grade || filters.status) && (
              <span className="filter-badge">•</span>
            )}
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          {userRole === 'admin' && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <FiPlus /> Add Class
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-small">
          <div className="stat-icon blue">
            <FiBook />
          </div>
          <div className="stat-content">
            <h3>{classes.length}</h3>
            <p>Total Classes</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon green">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{classes.filter(c => c.status === 'Active').length}</h3>
            <p>Active Classes</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon purple">
            <FiUser />
          </div>
          <div className="stat-content">
            <h3>{teachers.length}</h3>
            <p>Teachers</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon orange">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{classes.reduce((acc, c) => acc + c.students, 0)}</h3>
            <p>Total Students</p>
          </div>
        </div>
      </div>

      <div className="classes-grid">
        {filteredClasses.length === 0 ? (
          <div className="no-data full-width">
            <div className="no-data-content">
              <FiBook size={48} />
              <h3>No classes found</h3>
              <p>Try adjusting your filters or add a new class</p>
            </div>
          </div>
        ) : (
          filteredClasses.map(cls => (
            <Card key={cls.id} className="class-card">
              <div className="class-card-header">
                <div className="class-icon">
                  <FiBook />
                </div>
                <div className="class-title">
                  <h3>{cls.name}</h3>
                  <span className={`badge ${getStatusBadgeClass(cls.status)}`}>
                    {cls.status}
                  </span>
                </div>
              </div>
              
              <div className="class-details">
                <div className="detail-item">
                  <FiUser />
                  <span><strong>Teacher:</strong> {cls.teacher}</span>
                </div>
                <div className="detail-item">
                  <FiUsers />
                  <span><strong>Students:</strong> {cls.students}</span>
                </div>
                <div className="detail-item">
                  <FiClock />
                  <span><strong>Schedule:</strong> {cls.schedule}</span>
                </div>
                <div className="detail-item">
                  <FiCalendar />
                  <span><strong>Room:</strong> {cls.room}</span>
                </div>
                <div className="detail-item">
                  <FiBook />
                  <span><strong>Grade:</strong> {cls.grade}</span>
                </div>
              </div>

              <div className="class-actions">
                <button className="btn btn-outline btn-sm" onClick={() => toast.info('View class details')}>
                  <FiEye /> View Details
                </button>
                {userRole === 'admin' && (
                  <>
                    <button className="btn btn-outline btn-sm" onClick={() => toast.info('Edit class')}>
                      <FiEdit /> Edit
                    </button>
                    <button className="btn btn-outline btn-sm danger" onClick={() => toast.error('Delete class')}>
                      <FiTrash2 /> Delete
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Classes"
        size="md"
      >
        <div className="filter-form">
          <div className="form-group">
            <label>Teacher</label>
            <select 
              value={filters.teacher}
              onChange={(e) => handleFilterChange('teacher', e.target.value)}
            >
              <option value="">All Teachers</option>
              {teachers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Grade</label>
            <select 
              value={filters.grade}
              onChange={(e) => handleFilterChange('grade', e.target.value)}
            >
              <option value="">All Grades</option>
              {grades.map(g => (
                <option key={g} value={g}>Grade {g}</option>
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
              <option value="Inactive">Inactive</option>
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

      {/* Add Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Class"
        size="lg"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          toast.success('Class added successfully');
          setIsModalOpen(false);
        }} className="class-form">
          <div className="form-group">
            <label>Class Name *</label>
            <input type="text" required placeholder="e.g., Mathematics 101" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teacher *</label>
              <select required>
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Grade *</label>
              <select required>
                <option value="">Select Grade</option>
                {grades.map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Room *</label>
              <input type="text" required placeholder="e.g., 101" />
            </div>
            <div className="form-group">
              <label>Max Students</label>
              <input type="number" placeholder="30" min="1" />
            </div>
          </div>

          <div className="form-group">
            <label>Schedule *</label>
            <input type="text" required placeholder="e.g., Mon/Wed/Fri 9:00 AM" />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;