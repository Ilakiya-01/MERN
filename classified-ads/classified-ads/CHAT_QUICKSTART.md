# Chat Feature - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- MongoDB running locally or connection string ready
- Node.js installed
- Both backend and frontend servers running

### Step 1: Start the Backend
```bash
cd backend
npm run dev
```
The server should start on `http://localhost:5000`

### Step 2: Start the Frontend
```bash
cd frontend
npm start
```
The app should open at `http://localhost:3000`

## 📱 How to Use the Chat Feature

### For Buyers:

1. **Browse Products**
   - Go to the home page
   - Browse available products

2. **View Product Details**
   - Click on any product card
   - View full product information

3. **Start a Chat**
   - Click the "💬 Chat with Seller" button
   - You'll be redirected to the chat room

4. **Send Messages**
   - Type your message in the input field
   - Click "Send" or press Enter
   - Messages appear instantly

5. **View All Conversations**
   - Click "Messages" in the navbar
   - See all your active chats
   - Click any conversation to continue chatting

### For Sellers:

1. **Receive Messages**
   - Buyers can message you about your products
   - You'll see messages in real-time

2. **Access Conversations**
   - Click "Messages" in the navbar
   - View all buyer inquiries
   - Respond to questions

3. **Manage Conversations**
   - Click on any conversation to open it
   - Reply to buyer messages
   - Negotiate prices and details

## 🎯 Key Features

### Real-Time Communication
- **Instant Delivery**: Messages appear immediately for both users
- **No Refresh Needed**: Uses WebSocket for live updates
- **Persistent History**: All messages saved to database

### User-Friendly Interface
- **Clean Design**: Modern, intuitive chat interface
- **Message Bubbles**: Sent messages on right, received on left
- **Timestamps**: See when each message was sent
- **Auto-Scroll**: Automatically scrolls to latest message

### Navigation
- **Easy Access**: "Messages" link in navbar for logged-in users
- **Back Button**: Return to previous page from chat
- **Direct Links**: Chat button on product pages

## 🔧 Technical Details

### Chat Room Creation
- Rooms are automatically created when users start chatting
- Room ID format: `userId1-userId2` (sorted alphabetically)
- Both users join the same room

### Message Flow
1. User types and sends message
2. Message sent via Socket.io to server
3. Server saves to MongoDB
4. Server broadcasts to all users in room
5. Both users see message instantly

### Data Structure
```javascript
Message {
  sender: User ID,
  receiver: User ID,
  content: "Message text",
  room: "user1-user2",
  timestamp: Date
}
```

## 🐛 Troubleshooting

### Messages Not Appearing?
- Check if backend server is running
- Look for errors in browser console
- Verify Socket.io connection (should see "Socket connected" in console)

### Can't Send Messages?
- Make sure you're logged in
- Check if you have a valid authentication token
- Verify the other user exists

### Socket Connection Issues?
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `REACT_APP_API_URL` in frontend .env

## 📊 Testing Checklist

- [ ] Create two user accounts
- [ ] Post a product with User 1
- [ ] Login as User 2
- [ ] View the product
- [ ] Click "Chat with Seller"
- [ ] Send a message from User 2
- [ ] Switch to User 1
- [ ] Check "Messages" in navbar
- [ ] See the conversation
- [ ] Reply to User 2
- [ ] Verify both users see messages in real-time

## 🎨 UI Components

### ChatRoom
- **Header**: Shows other user's name and back button
- **Messages Area**: Displays conversation history
- **Input Form**: Text field and send button

### ChatList
- **Header**: "My Conversations" title
- **Conversation Items**: List of all chats
- **Last Message**: Preview of most recent message
- **Empty State**: Message when no conversations exist

## 🔐 Security

- All chat routes require authentication
- JWT tokens validated on each request
- User IDs verified before message creation
- CORS configured for allowed origins only

## 📝 Notes

- Messages are stored permanently in MongoDB
- Chat history loads when entering a room
- Socket.io handles reconnection automatically
- Works on mobile and desktop browsers

## 🎉 Success!

You now have a fully functional real-time chat system! Users can:
- ✅ Chat with sellers about products
- ✅ View all conversations in one place
- ✅ Send and receive messages instantly
- ✅ Access chat history anytime

---

**Need Help?** Check the full documentation in `CHAT_FEATURE.md`
