# Real-Time Chat Feature Documentation

## Overview
This classified ads platform now includes a real-time chat system that allows buyers and sellers to communicate instantly using Socket.io.

## Features

### 1. **Real-Time Messaging**
- Instant message delivery using WebSocket connections
- Messages are stored in MongoDB for persistence
- Automatic reconnection on connection loss

### 2. **Chat Room**
- One-on-one conversations between buyers and sellers
- Message history is loaded when entering a chat
- Real-time message updates
- Timestamp for each message
- Smooth scrolling to latest messages

### 3. **Conversations List**
- View all your active conversations
- See the last message in each conversation
- Quick access to chat with any user you've messaged

### 4. **User Interface**
- Modern, responsive design
- Color-coded messages (sent vs received)
- Mobile-friendly layout
- Smooth animations and transitions

## Architecture

### Backend Components

#### 1. **Socket.io Server** (`backend/socket.js`)
- Handles WebSocket connections
- Manages chat rooms
- Broadcasts messages to room participants
- Saves messages to database

#### 2. **Message Model** (`backend/models/Message.js`)
```javascript
{
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  room: String,
  timestamp: Date
}
```

#### 3. **Chat Routes** (`backend/routes/chat.js`)
- `GET /api/chat/conversations` - Get all conversations for current user
- `GET /api/chat/:userId` - Get messages between two users
- `POST /api/chat/send` - Send message (HTTP fallback)

### Frontend Components

#### 1. **ChatRoom Component** (`frontend/src/components/Chat/ChatRoom.js`)
- Displays messages between two users
- Real-time message sending/receiving
- Auto-scrolls to latest messages
- Shows user info in header

#### 2. **ChatList Component** (`frontend/src/components/Chat/ChatList.js`)
- Lists all conversations
- Shows last message preview
- Displays unread count (future enhancement)

#### 3. **Socket Service** (`frontend/src/services/socket.js`)
- Manages WebSocket connection
- Handles reconnection logic
- Provides socket instance to components

## How It Works

### Starting a Chat
1. User views a product detail page
2. Clicks "💬 Chat with Seller" button
3. Redirected to `/chat/:sellerId`
4. Chat room is created with sorted user IDs (e.g., `user1-user2`)

### Sending Messages
1. User types message and clicks "Send"
2. Message is emitted via Socket.io with event `sendMessage`
3. Server receives message and saves to database
4. Server broadcasts message to all users in the room
5. Both sender and receiver see the message instantly

### Room Identifier
- Rooms are identified by sorted user IDs: `[userId1, userId2].sort().join('-')`
- This ensures both users join the same room regardless of who initiated the chat

## Socket.io Events

### Client → Server
- `joinRoom` - Join a specific chat room
  ```javascript
  socket.emit('joinRoom', { room: 'user1-user2' });
  ```

- `sendMessage` - Send a message
  ```javascript
  socket.emit('sendMessage', {
    sender: userId,
    receiver: otherUserId,
    content: messageText,
    room: roomId
  });
  ```

### Server → Client
- `receiveMessage` - Receive a new message
  ```javascript
  socket.on('receiveMessage', (message) => {
    // Handle incoming message
  });
  ```

- `error` - Error notification
  ```javascript
  socket.on('error', (error) => {
    // Handle error
  });
  ```

## Routes

### Frontend Routes
- `/chat` - List of all conversations (protected)
- `/chat/:userId` - Chat room with specific user (protected)

### Backend API Routes
- `GET /api/chat/conversations` - Get all conversations (protected)
- `GET /api/chat/:userId` - Get messages with user (protected)
- `POST /api/chat/send` - Send message via HTTP (protected)

## Usage Example

### For Buyers
1. Browse products on the home page
2. Click on a product to view details
3. Click "💬 Chat with Seller" button
4. Start chatting with the seller
5. Access all conversations from "Messages" in navbar

### For Sellers
1. Receive messages from interested buyers
2. Access conversations from "Messages" in navbar
3. Respond to buyer inquiries
4. Negotiate prices and arrange meetings

## Security Features
- All chat routes are protected (require authentication)
- User IDs are validated before creating messages
- Socket connections are authenticated
- CORS is configured for allowed origins

## Future Enhancements
- [ ] Unread message count
- [ ] Message read receipts
- [ ] Typing indicators
- [ ] Image/file sharing in chat
- [ ] Message search functionality
- [ ] Block/report users
- [ ] Push notifications for new messages
- [ ] Message deletion
- [ ] Group chats for multiple buyers

## Testing the Feature

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test the chat:**
   - Create two user accounts
   - Post a product with one account
   - View the product with the other account
   - Click "Chat with Seller"
   - Send messages back and forth
   - Check that messages appear in real-time

## Troubleshooting

### Messages not appearing in real-time
- Check browser console for Socket.io connection errors
- Verify backend server is running
- Check CORS configuration in `backend/server.js`

### Cannot send messages
- Ensure user is authenticated
- Check network tab for API errors
- Verify MongoDB connection is active

### Socket connection fails
- Check `REACT_APP_API_URL` environment variable
- Verify backend port matches frontend configuration
- Check firewall settings

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Dependencies

### Backend
- `socket.io: ^4.7.2` - WebSocket server
- `express: ^4.18.2` - HTTP server
- `mongoose: ^7.5.0` - MongoDB ODM

### Frontend
- `socket.io-client: ^4.7.2` - WebSocket client
- `react-router-dom: ^6.11.2` - Routing
- `axios: ^1.4.0` - HTTP client

---

**Note:** This chat system is designed for real-time communication between buyers and sellers. All messages are persisted in the database and can be retrieved even after disconnection.
