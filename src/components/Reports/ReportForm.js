import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ReportForm = ({ onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [step, setStep] = useState(1);

  const onSubmit = (data) => {
    onSave(data);
  };

  const students = [
    { id: 1, name: 'John Doe', grade: '10' },
    { id: 2, name: 'Jane Smith', grade: '9' },
    { id: 3, name: 'Mike Johnson', grade: '11' },
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 && (
        <>
          <div className="form-group">
            <label>Select Student *</label>
            <select {...register('studentId', { required: 'Student is required' })}>
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Grade {student.grade})
                </option>
              ))}
            </select>
            {errors.studentId && <span className="error">{errors.studentId.message}</span>}
          </div>

          <div className="form-group">
            <label>Incident Type *</label>
            <select {...register('type', { required: 'Incident type is required' })}>
              <option value="">Select type</option>
              <option value="Disruption">Classroom Disruption</option>
              <option value="Behavior">Inappropriate Behavior</option>
              <option value="Late Submission">Late Assignment</option>
              <option value="Attendance">Attendance Issue</option>
              <option value="Other">Other</option>
            </select>
            {errors.type && <span className="error">{errors.type.message}</span>}
          </div>

          <div className="form-group">
            <label>Severity Level *</label>
            <select {...register('severity', { required: 'Severity is required' })}>
              <option value="">Select severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.severity && <span className="error">{errors.severity.message}</span>}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="form-group">
            <label>Incident Date *</label>
            <input 
              type="date" 
              {...register('incidentDate', { required: 'Date is required' })} 
            />
            {errors.incidentDate && <span className="error">{errors.incidentDate.message}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea 
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' }
              })} 
              rows="5"
              placeholder="Provide detailed description of the incident..."
            />
            {errors.description && <span className="error">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Actions Taken</label>
            <textarea 
              {...register('actionsTaken')} 
              rows="3"
              placeholder="Describe actions taken to address the incident..."
            />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        
        {step > 1 && (
          <button type="button" onClick={prevStep} className="btn btn-outline">
            Previous
          </button>
        )}
        
        {step < 2 ? (
          <button type="button" onClick={nextStep} className="btn btn-primary">
            Next
          </button>
        ) : (
          <button type="submit" className="btn btn-primary">
            Submit Report
          </button>
        )}
      </div>
    </form>
  );
};

export default ReportForm;