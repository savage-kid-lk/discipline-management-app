import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { FiPlus, FiDownload, FiFilter, FiEye, FiEdit, FiTrash2, FiSearch, FiX, FiCalendar, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getIncidents, addIncident, updateIncident, getStudents } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Reports.css';

const Reports = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    type: '',
    dateRange: ''
  });
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    type: '',
    severity: '',
    description: '',
    incidentDate: '',
    actionsTaken: '',
    reportedBy: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [searchTerm, filters, incidents]);

  const fetchData = async () => {
    setLoading(true);
    const [incidentsRes, studentsRes] = await Promise.all([
      getIncidents(),
      getStudents()
    ]);
    
    if (incidentsRes.success) {
      setIncidents(incidentsRes.data);
      setFilteredIncidents(incidentsRes.data);
    }
    if (studentsRes.success) setStudents(studentsRes.data);
    
    setLoading(false);
  };

  const filterIncidents = () => {
    let filtered = [...incidents];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(incident => 
        incident.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply severity filter
    if (filters.severity) {
      filtered = filtered.filter(incident => incident.severity === filters.severity);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(incident => incident.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(incident => incident.type === filters.type);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(incident => new Date(incident.incidentDate) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(filterDate.getDate() - 7);
          filtered = filtered.filter(incident => new Date(incident.incidentDate) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(filterDate.getMonth() - 1);
          filtered = filtered.filter(incident => new Date(incident.incidentDate) >= filterDate);
          break;
      }
    }

    setFilteredIncidents(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'studentId') {
      const student = students.find(s => s.id === value);
      if (student) {
        setFormData(prev => ({
          ...prev,
          studentName: student.name
        }));
      }
    }
  };

  const handleAddIncident = () => {
    if (userRole !== 'admin' && userRole !== 'teacher') {
      toast.error('Only admins and teachers can create reports');
      return;
    }
    setFormData({
      studentId: '',
      studentName: '',
      type: '',
      severity: '',
      description: '',
      incidentDate: new Date().toISOString().split('T')[0],
      actionsTaken: '',
      reportedBy: userRole
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const incidentData = {
      ...formData,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    const result = await addIncident(incidentData);
    
    if (result.success) {
      toast.success('Incident report created successfully');
      setIsModalOpen(false);
      fetchData();
    } else {
      toast.error(result.error || 'Failed to create report');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Student', 'Type', 'Severity', 'Date', 'Status', 'Description', 'Actions Taken'].join(','),
      ...filteredIncidents.map(i => [
        i.studentName,
        i.type,
        i.severity,
        new Date(i.incidentDate).toLocaleDateString(),
        i.status,
        `"${i.description.replace(/"/g, '""')}"`,
        `"${(i.actionsTaken || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Reports exported successfully');
  };

  const clearFilters = () => {
    setFilters({
      severity: '',
      status: '',
      type: '',
      dateRange: ''
    });
    setSearchTerm('');
    setIsFilterModalOpen(false);
  };

  const getSeverityClass = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'badge-danger';
      case 'in progress': return 'badge-warning';
      case 'resolved': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return <FiAlertTriangle />;
      case 'in progress': return <FiClock />;
      case 'resolved': return <FiCheckCircle />;
      default: return <FiAlertTriangle />;
    }
  };

  const incidentTypes = ['Disruption', 'Behavior', 'Late Submission', 'Attendance', 'Other'];
  const severityLevels = ['Low', 'Medium', 'High'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Incident Reports</h1>
          <p className="page-subtitle">Track and manage student incidents</p>
        </div>
        <div className="page-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search reports..." 
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
            {(filters.severity || filters.status || filters.type || filters.dateRange) && (
              <span className="filter-badge">•</span>
            )}
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          {(userRole === 'admin' || userRole === 'teacher') && (
            <button className="btn btn-primary" onClick={handleAddIncident}>
              <FiPlus /> Create Report
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-small">
          <div className="stat-icon red">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <h3>{incidents.filter(i => i.status === 'open').length}</h3>
            <p>Open Incidents</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon orange">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>{incidents.filter(i => i.status === 'in progress').length}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon green">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{incidents.filter(i => i.status === 'resolved').length}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card-small">
          <div className="stat-icon blue">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <h3>{incidents.filter(i => i.severity === 'High').length}</h3>
            <p>High Severity</p>
          </div>
        </div>
      </div>

      <Card className="reports-table-card">
        <div className="table-header">
          <div className="table-title">
            <h3>Incident Reports</h3>
            <span className="record-count">{filteredIncidents.length} reports</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    <div className="no-data-content">
                      <FiAlertTriangle size={48} />
                      <h3>No reports found</h3>
                      <p>Try adjusting your filters or create a new report</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(incident => (
                  <tr key={incident.id}>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {incident.studentName?.charAt(0) || '?'}
                        </div>
                        {incident.studentName}
                      </div>
                    </td>
                    <td>
                      <span className="incident-type">{incident.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${getSeverityClass(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td>
                      <div className="date-cell">
                        <FiCalendar />
                        {new Date(incident.incidentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusClass(incident.status)}`}>
                        <span className="status-icon">{getStatusIcon(incident.status)}</span>
                        {incident.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => toast.info('View details')} title="View">
                          <FiEye />
                        </button>
                        {(userRole === 'admin' || userRole === 'teacher') && (
                          <>
                            <button className="btn-icon" onClick={() => toast.info('Edit incident')} title="Edit">
                              <FiEdit />
                            </button>
                            <button className="btn-icon danger" onClick={() => toast.error('Delete incident')} title="Delete">
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
        title="Filter Reports"
        size="md"
      >
        <div className="filter-form">
          <div className="form-group">
            <label>Severity</label>
            <select 
              value={filters.severity}
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
            >
              <option value="">All Severities</option>
              {severityLevels.map(s => (
                <option key={s} value={s}>{s}</option>
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
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label>Incident Type</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              {incidentTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date Range</label>
            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
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

      {/* Create Report Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Incident Report"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Select Student *</label>
            <select 
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Grade {student.grade})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Incident Type *</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                {incidentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Severity *</label>
              <select 
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select severity</option>
                {severityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Incident Date *</label>
            <input 
              type="date" 
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              placeholder="Provide detailed description of the incident..."
              required
            />
          </div>

          <div className="form-group">
            <label>Actions Taken</label>
            <textarea 
              name="actionsTaken"
              value={formData.actionsTaken}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe actions taken..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reports;