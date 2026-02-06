import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiSend, FiSearch, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Jane Smith (Parent)', preview: 'Regarding John\'s behavior...', time: '10:30 AM', unread: true },
    { id: 2, sender: 'Mr. Smith (Teacher)', preview: 'Class schedule update...', time: 'Yesterday', unread: false },
    { id: 3, sender: 'Ms. Johnson (Teacher)', preview: 'Parent meeting reminder...', time: 'Jan 12', unread: false },
  ]);
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success('Message sent successfully');
      setNewMessage('');
    }
  };

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
      </div>

      <Card className="messages-container">
        <div className="messages-sidebar">
          <div className="messages-search">
            <FiSearch />
            <input type="text" placeholder="Search messages..." />
          </div>
          <div className="messages-list">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message-item ${selectedMessage?.id === message.id ? 'active' : ''} ${message.unread ? 'unread' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-avatar">
                  <FiUser />
                </div>
                <div className="message-info">
                  <h4>{message.sender}</h4>
                  <p>{message.preview}</p>
                </div>
                <div className="message-meta">
                  <span className="time">{message.time}</span>
                  {message.unread && <span className="unread-badge"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="messages-content">
          {selectedMessage ? (
            <>
              <div className="message-header">
                <div className="message-sender">
                  <div className="avatar"><FiUser /></div>
                  <div>
                    <h3>{selectedMessage.sender}</h3>
                    <p>Active now</p>
                  </div>
                </div>
              </div>
              
              <div className="message-thread">
                <div className="message received">
                  <div className="message-content">
                    <p>Hello, I wanted to discuss my child's recent behavior in class.</p>
                    <span className="message-time">10:30 AM</span>
                  </div>
                </div>
                <div className="message sent">
                  <div className="message-content">
                    <p>I understand your concern. Let's schedule a meeting to discuss this.</p>
                    <span className="message-time">10:35 AM</span>
                  </div>
                </div>
              </div>

              <div className="message-input">
                <textarea 
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows="3"
                />
                <button onClick={handleSendMessage} className="btn btn-primary send-btn">
                  <FiSend /> Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-message-selected">
              <div className="empty-state">
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Messages;