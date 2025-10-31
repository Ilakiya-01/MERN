import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import './ChatList.css';

const ChatList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchConversations();
  }, [user, navigate]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="chat-list-loading">Loading conversations...</div>;
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>My Conversations</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="no-conversations">
          <p>No conversations yet.</p>
          <p>Start chatting with sellers from product pages!</p>
          <Link to="/" className="browse-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map((conversation) => (
            <Link
              key={conversation.userId}
              to={`/chat/${conversation.userId}`}
              className="conversation-item"
            >
              <div className="conversation-info">
                <h3>{conversation.userName}</h3>
                <p className="last-message">
                  {conversation.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              <div className="conversation-meta">
                {conversation.lastMessage && (
                  <span className="last-message-time">
                    {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                  </span>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="unread-badge">{conversation.unreadCount}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
