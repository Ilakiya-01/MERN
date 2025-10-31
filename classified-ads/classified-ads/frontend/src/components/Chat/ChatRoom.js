import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import socket from '../../services/socket';
import api from '../../services/api';
import './ChatRoom.css';

const ChatRoom = ({ userId: propUserId, sellerName, onClose }) => {
  const { userId: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const roomRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Create room identifier (sorted user IDs)
    const room = [user.id, userId].sort().join('-');
    roomRef.current = room;

    // Fetch other user's info
    fetchOtherUser();

    // Fetch previous messages
    fetchMessages();

    // Join the room
    socket.emit('joinRoom', { room });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      alert(error.message || 'An error occurred');
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('error');
    };
  }, [userId, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOtherUser = async () => {
    try {
      const res = await api.get(`/auth/users/${userId}`);
      setOtherUser(res.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user.id,
      receiver: userId,
      content: newMessage.trim(),
      room: roomRef.current,
    };

    // Emit message via socket
    socket.emit('sendMessage', messageData);

    // Clear input
    setNewMessage('');
  };

  if (loading) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button className="back-btn" onClick={() => onClose ? onClose() : navigate(-1)}>
          ← {onClose ? 'Close' : 'Back'}
        </button>
        <h2>Chat with {sellerName || otherUser?.name || 'User'}</h2>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`message ${
                message.sender._id === user.id || message.sender === user.id
                  ? 'sent'
                  : 'received'
              }`}
            >
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
