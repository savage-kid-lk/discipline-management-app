import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/UI/Card';
import { FiFileText, FiDownload, FiFilter, FiSend, FiLoader } from 'react-icons/fi';
import ReportForm from '../../components/Reports/ReportForm';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';
import { reportsAPI } from '../../api/reports';
import '../../Styles/Reports.css';

const Reports = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reportsAPI.getAll();
      setReports(data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleCreateReport = () => {
    setIsReportModalOpen(true);
  };

  const handleSaveReport = async (reportData) => {
    try {
      const newReport = await reportsAPI.create(reportData);
      setReports([newReport, ...reports]);
      setIsReportModalOpen(false);
      toast.success('Incident report created successfully');
    } catch (error) {
      toast.error('Failed to create report');
    }
  };

  const handleExportReport = async (reportId) => {
    try {
      toast.loading('Generating PDF...');
      const blob = await reportsAPI.exportPDF(reportId);
      // Create a link to download the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.dismiss();
      toast.success('Download started');
    } catch (error) {
      toast.dismiss();
      toast.error('Export failed');
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1 className="page-title">Incident Reports</h1>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={fetchReports}>
            {isLoading ? <FiLoader className="spin" /> : <FiFilter />} Refresh
          </button>
          <button className="btn btn-primary" onClick={handleCreateReport}>
            <FiFileText /> Create Report
          </button>
        </div>
      </div>

      <Card>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Student</th>
                <th>Teacher</th>
                <th>Incident Type</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{textAlign: 'center'}}>Loading...</td></tr>
              ) : reports.map((report) => (
                <tr key={report.id}>
                  <td>RPT-{report.id.toString().padStart(3, '0')}</td>
                  <td>{report.studentName}</td>
                  <td>{report.teacherName}</td>
                  <td>{report.type}</td>
                  <td>
                    <span className={`badge severity-${report.severity.toLowerCase()}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td>{new Date(report.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon">
                        <FiSend />
                      </button>
                      <button onClick={() => handleExportReport(report.id)} className="btn-icon">
                        <FiDownload />
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
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Create Incident Report"
        size="lg"
      >
        <ReportForm onSave={handleSaveReport} onCancel={() => setIsReportModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Reports;