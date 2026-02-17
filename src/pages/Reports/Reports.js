import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import { FiPlus, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { getIncidents, addIncident, updateIncident, getStudents } from '../../firebase';
import toast from 'react-hot-toast';
import '../../Styles/Reports.css';

const Reports = ({ userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchData = async () => {
    setLoading(true);
    const [incidentsRes, studentsRes] = await Promise.all([
      getIncidents(),
      getStudents()
    ]);
    
    if (incidentsRes.success) setIncidents(incidentsRes.data);
    if (studentsRes.success) setStudents(studentsRes.data);
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill student name when student is selected
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
        <h1 className="page-title">Incident Reports</h1>
        <div className="page-actions">
          {(userRole === 'admin' || userRole === 'teacher') && (
            <button className="btn btn-primary" onClick={handleAddIncident}>
              <FiPlus /> Create Report
            </button>
          )}
        </div>
      </div>

      <Card>
        <div className="table-responsive">
          <table>
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
              {incidents.map(incident => (
                <tr key={incident.id}>
                  <td>{incident.studentName}</td>
                  <td>{incident.type}</td>
                  <td>
                    <span className={`badge ${getSeverityClass(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td>{new Date(incident.incidentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${getStatusClass(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => toast.info('View details')}>
                        <FiEye />
                      </button>
                      {(userRole === 'admin' || userRole === 'teacher') && (
                        <button className="btn-icon" onClick={() => toast.info('Edit incident')}>
                          <FiEdit />
                        </button>
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
                <option value="Disruption">Classroom Disruption</option>
                <option value="Behavior">Inappropriate Behavior</option>
                <option value="Late Submission">Late Assignment</option>
                <option value="Attendance">Attendance Issue</option>
                <option value="Other">Other</option>
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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