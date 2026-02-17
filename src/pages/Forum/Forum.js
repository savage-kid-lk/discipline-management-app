import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiThumbsUp, FiMessageCircle, FiPlus, FiMapPin } from 'react-icons/fi';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';
import '../../Styles/Forum.css';

const Forum = ({ userRole }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: 'Welcome to the Forum', 
      content: 'This is a place for discussion about teaching strategies and student management.',
      category: 'General Discussion', 
      authorName: 'Admin', 
      likes: 5, 
      replies: [], 
      isPinned: true,
      createdAt: new Date(),
      visibility: 'public'
    },
    { 
      id: 2, 
      title: 'New Teaching Strategy', 
      content: 'I found this new method for classroom management...',
      category: 'Teaching Strategies', 
      authorName: 'Mr. Smith', 
      likes: 3, 
      replies: [
        { content: 'Great idea!', userRole: 'teacher', timestamp: new Date() }
      ], 
      isPinned: false,
      createdAt: new Date(),
      visibility: 'public'
    },
  ]);

  const handleCreatePost = () => {
    if (userRole !== 'admin' && userRole !== 'teacher') {
      toast.error('You do not have permission to create forum posts');
      return;
    }
    setIsPostModalOpen(true);
  };

  const handleSavePost = (postData) => {
    const newPost = {
      id: posts.length + 1,
      ...postData,
      authorName: 'Current User',
      likes: 0,
      replies: [],
      isPinned: false,
      createdAt: new Date()
    };
    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    toast.success('Post created successfully');
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
    ));
    toast.success('Post liked!');
  };

  return (
    <div className="forum-page">
      <div className="page-header">
        <h1 className="page-title">Community Forum</h1>
        <div className="page-actions">
          {(userRole === 'admin' || userRole === 'teacher') && (
            <button className="btn btn-primary" onClick={handleCreatePost}>
              <FiPlus /> New Post
            </button>
          )}
        </div>
      </div>

      <Card>
        <div className="forum-posts">
          {posts.map((post) => (
            <div key={post.id} className={`forum-post ${post.isPinned ? 'pinned' : ''}`}>
              {post.isPinned && <span className="pin-badge"><FiMapPin /> Pinned</span>}
              
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="post-category">{post.category}</span>
              </div>
              
              <p className="post-content">{post.content}</p>
              
              <div className="post-meta">
                <div className="post-author">
                  <span>Posted by {post.authorName}</span>
                  <span className="post-date">
                    {post.createdAt?.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="post-stats">
                  <button className="stat-btn" onClick={() => handleLikePost(post.id)}>
                    <FiThumbsUp /> {post.likes || 0}
                  </button>
                  <button className="stat-btn">
                    <FiMessageCircle /> {post.replies?.length || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Create New Post"
        size="lg"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleSavePost({
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category')
          });
        }}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" name="title" required placeholder="Enter post title" />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" required>
              <option value="">Select Category</option>
              <option value="General Discussion">General Discussion</option>
              <option value="Teaching Strategies">Teaching Strategies</option>
              <option value="Behavior Management">Behavior Management</option>
            </select>
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea name="content" rows="6" required placeholder="Write your post content here..." />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsPostModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Post
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Forum;