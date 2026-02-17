import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import { FiSend, FiSearch } from 'react-icons/fi';

const Messages = ({ userRole }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations] = useState([
    { id: 1, name: 'Mr. Smith', lastMessage: 'About the incident report...', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Ms. Johnson', lastMessage: 'Class schedule updated', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Parent Group', lastMessage: 'Meeting tomorrow', time: 'Yesterday', unread: 1 },
  ]);

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <button className="btn btn-primary">New Message</button>
      </div>

      <Card className="messages-container">
        <div className="messages-sidebar">
          <div className="messages-search">
            <FiSearch />
            <input type="text" placeholder="Search conversations..." />
          </div>
          <div className="conversations-list">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`conversation-item ${selectedChat === conv.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(conv.id)}
              >
                <div className="conversation-avatar">
                  {conv.name.charAt(0)}
                </div>
                <div className="conversation-info">
                  <h4>{conv.name}</h4>
                  <p className="conversation-preview">{conv.lastMessage}</p>
                </div>
                <div className="conversation-meta">
                  <span className="time">{conv.time}</span>
                  {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="messages-content">
          {selectedChat ? (
            <>
              <div className="message-header">
                <h3>{conversations.find(c => c.id === selectedChat)?.name}</h3>
              </div>
              <div className="message-thread">
                {/* Messages would go here */}
              </div>
              <div className="message-input">
                <textarea placeholder="Type your message..." rows="3"></textarea>
                <button className="btn btn-primary send-btn">
                  <FiSend /> Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <h3>Select a conversation to start messaging</h3>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Messages;