import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import StudentTable from '../../components/Students/StudentTable';
import StudentForm from '../../components/Students/StudentForm';
import Modal from '../../components/UI/Modal';
import { FiPlus, FiDownload, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../Styles/Students.css';

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([
    { 
      id: 1, 
      studentId: 'S001', 
      firstName: 'John', 
      lastName: 'Doe',
      name: 'John Doe',
      grade: '10', 
      parentName: 'Jane Doe', 
      parentEmail: 'jane@example.com',
      incidents: 2, 
      status: 'Active',
      dateOfBirth: '2008-05-15'
    },
    { 
      id: 2, 
      studentId: 'S002', 
      firstName: 'Alice', 
      lastName: 'Smith',
      name: 'Alice Smith',
      grade: '9', 
      parentName: 'Bob Smith', 
      parentEmail: 'bob@example.com',
      incidents: 0, 
      status: 'Active',
      dateOfBirth: '2009-03-22'
    },
    { 
      id: 3, 
      studentId: 'S003', 
      firstName: 'Mike', 
      lastName: 'Johnson',
      name: 'Mike Johnson',
      grade: '11', 
      parentName: 'Sarah Johnson', 
      parentEmail: 'sarah@example.com',
      incidents: 5, 
      status: 'Warning',
      dateOfBirth: '2007-11-10'
    },
    { 
      id: 4, 
      studentId: 'S004', 
      firstName: 'Emma', 
      lastName: 'Wilson',
      name: 'Emma Wilson',
      grade: '8', 
      parentName: 'David Wilson', 
      parentEmail: 'david@example.com',
      incidents: 1, 
      status: 'Active',
      dateOfBirth: '2010-01-30'
    },
  ]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
      toast.success('Student deleted successfully');
    }
  };

  const handleSaveStudent = (studentData) => {
    if (editingStudent) {
      const updatedStudent = { 
        ...editingStudent, 
        ...studentData,
        name: `${studentData.firstName} ${studentData.lastName}`
      };
      setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
      toast.success('Student updated successfully');
    } else {
      const newStudent = { 
        id: students.length + 1, 
        ...studentData,
        name: `${studentData.firstName} ${studentData.lastName}`,
        incidents: 0
      };
      setStudents([...students, newStudent]);
      toast.success('Student added successfully');
    }
    setIsModalOpen(false);
  };

  const handleViewStudent = (student) => {
    // Navigate to student detail page or show modal
    toast.success(`Viewing student: ${student.name}`);
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <div className="page-actions">
          <button className="btn btn-outline">
            <FiFilter /> Filter
          </button>
          <button className="btn btn-outline">
            <FiDownload /> Export
          </button>
          <button className="btn btn-primary" onClick={handleAddStudent}>
            <FiPlus /> Add Student
          </button>
        </div>
      </div>

      <Card>
        <StudentTable
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Students;