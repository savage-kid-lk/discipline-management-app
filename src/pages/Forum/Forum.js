import React, { useState, useEffect } from 'react';
import Card from '../../components/UI/Card';
import { FiThumbsUp, FiMessageCircle, FiPlus } from 'react-icons/fi';
import ForumPostForm from '../../components/Forum/ForumPostForm';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';
import { forumAPI } from '../../api/forum';
import '../../Styles/Forum.css';

const Forum = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await forumAPI.getPosts();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load forum posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (postData) => {
    try {
      const newPost = await forumAPI.createPost(postData);
      setPosts([newPost, ...posts]);
      setIsPostModalOpen(false);
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      // Optimistic update
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
      await forumAPI.likePost(postId);
    } catch (error) {
      // Revert if failed
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
      toast.error('Failed to like post');
    }
  };

  return (
    <div className="forum-page">
      <div className="page-header">
        <h1 className="page-title">Community Forum</h1>
        <button className="btn btn-primary" onClick={handleCreatePost}>
          <FiPlus /> New Post
        </button>
      </div>

      <Card>
        <div className="forum-posts">
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Loading discussions...</div>
          ) : posts.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px'}}>No posts yet. Be the first to start a discussion!</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={`forum-post ${post.isPinned ? 'pinned' : ''}`}>
                {post.isPinned && <span className="pin-badge">Pinned</span>}
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className="post-category">{post.category}</span>
                </div>
                <p className="post-content">{post.content}</p>
                <div className="post-meta">
                  <div className="post-author">
                    <span>Posted by {post.authorName}</span>
                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="post-stats">
                    <button className="stat-btn" onClick={() => handleLikePost(post.id)}>
                      <FiThumbsUp /> {post.likes}
                    </button>
                    <button className="stat-btn">
                      <FiMessageCircle /> {post.repliesCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Create New Post"
        size="lg"
      >
        <ForumPostForm onSave={handleSavePost} onCancel={() => setIsPostModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Forum;