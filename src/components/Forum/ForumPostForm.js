import React from 'react';
import { useForm } from 'react-hook-form';

const ForumPostForm = ({ onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Title *</label>
        <input 
          {...register('title', { required: 'Title is required' })} 
          placeholder="Enter post title"
        />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>Category *</label>
        <select {...register('category', { required: 'Category is required' })}>
          <option value="">Select Category</option>
          <option value="Behavior Management">Behavior Management</option>
          <option value="Teaching Strategies">Teaching Strategies</option>
          <option value="Technology">Technology</option>
          <option value="General Discussion">General Discussion</option>
          <option value="AI Integration">AI Integration</option>
        </select>
        {errors.category && <span className="error">{errors.category.message}</span>}
      </div>

      <div className="form-group">
        <label>Content *</label>
        <textarea 
          {...register('content', { 
            required: 'Content is required',
            minLength: { value: 20, message: 'Content must be at least 20 characters' }
          })} 
          rows="6"
          placeholder="Write your post content here..."
        />
        {errors.content && <span className="error">{errors.content.message}</span>}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </div>
    </form>
  );
};

export default ForumPostForm;