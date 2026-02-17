import React, { useState } from 'react';
import { FiMail, FiGlobe } from 'react-icons/fi';

const ForumReplyForm = ({ post, onSave, onCancel, userRole }) => {
  const [formData, setFormData] = useState({
    content: '',
    isPrivate: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your Reply *</label>
        <textarea 
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows="5"
          placeholder="Enter your reply here..."
          required
        />
      </div>

      {userRole === 'parent' && (
        <div className="form-group">
          <div className="reply-options">
            <label className="radio">
              <input 
                type="radio"
                name="replyType"
                value="public"
                checked={!formData.isPrivate}
                onChange={() => setFormData({...formData, isPrivate: false})}
              />
              <span>
                <FiGlobe /> Public Reply (Visible to all)
              </span>
            </label>
            <label className="radio">
              <input 
                type="radio"
                name="replyType"
                value="private"
                checked={formData.isPrivate}
                onChange={() => setFormData({...formData, isPrivate: true})}
              />
              <span>
                <FiMail /> Private Reply (Email only)
              </span>
            </label>
          </div>
          <p className="help-text">
            Public replies are visible to all users. Private replies will be sent via email only.
          </p>
        </div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {formData.isPrivate ? 'Send Private Reply' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
};

export default ForumReplyForm;