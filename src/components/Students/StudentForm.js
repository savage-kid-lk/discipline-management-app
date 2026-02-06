import React from 'react';
import { useForm } from 'react-hook-form';

const StudentForm = ({ student, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: student || {
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
    }
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="student-form">
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input 
            {...register('firstName', { required: 'First name is required' })} 
            placeholder="John"
          />
          {errors.firstName && <span className="error">{errors.firstName.message}</span>}
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input 
            {...register('lastName', { required: 'Last name is required' })} 
            placeholder="Doe"
          />
          {errors.lastName && <span className="error">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Student ID *</label>
          <input 
            {...register('studentId', { required: 'Student ID is required' })} 
            placeholder="S001"
          />
          {errors.studentId && <span className="error">{errors.studentId.message}</span>}
        </div>
        <div className="form-group">
          <label>Grade *</label>
          <select {...register('grade', { required: 'Grade is required' })}>
            <option value="">Select Grade</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          {errors.grade && <span className="error">{errors.grade.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date" 
            {...register('dateOfBirth')} 
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select {...register('status')}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Warning">Warning</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h4>Parent/Guardian Information</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Parent Name *</label>
            <input 
              {...register('parentName', { required: 'Parent name is required' })} 
              placeholder="Jane Doe"
            />
            {errors.parentName && <span className="error">{errors.parentName.message}</span>}
          </div>
          <div className="form-group">
            <label>Parent Email *</label>
            <input 
              type="email"
              {...register('parentEmail', { 
                required: 'Parent email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })} 
              placeholder="parent@example.com"
            />
            {errors.parentEmail && <span className="error">{errors.parentEmail.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Parent Phone</label>
            <input 
              {...register('parentPhone')} 
              placeholder="(123) 456-7890"
            />
          </div>
          <div className="form-group">
            <label>Relationship</label>
            <select {...register('relationship')}>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea 
          {...register('address')} 
          rows="3"
          placeholder="123 Main St, City, State, ZIP"
        />
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea 
          {...register('notes')} 
          rows="3"
          placeholder="Any additional information..."
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {student ? 'Update Student' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;