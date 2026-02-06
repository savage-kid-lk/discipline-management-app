import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(students.length / itemsPerPage);

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Parent</th>
            <th>Incidents</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.parentName}</td>
              <td>
                <span className={`badge ${student.incidents > 2 ? 'badge-danger' : 'badge-warning'}`}>
                  {student.incidents}
                </span>
              </td>
              <td>
                <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                  {student.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onView(student)} className="btn-icon">
                    <FiEye />
                  </button>
                  <button onClick={() => onEdit(student)} className="btn-icon">
                    <FiEdit />
                  </button>
                  <button onClick={() => onDelete(student.id)} className="btn-icon danger">
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;