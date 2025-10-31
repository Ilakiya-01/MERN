# Classified Ads Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for a classified ads platform similar to OLX. Features include user authentication, product listings, search, real-time chat, and secure payments.

## Features

- User registration and login with JWT authentication
- CRUD operations for product listings with image uploads
- Search functionality across products
- Real-time chat between buyers and sellers using Socket.io
- Payment processing with Stripe
- Responsive React frontend

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Socket.io
- **Frontend**: React.js, React Router, Axios
- **Authentication**: JWT
- **Payments**: Stripe
- **Real-time**: Socket.io
- **File Uploads**: Multer

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payments

### Installation

1. Clone or download the project:
   ```
   cd classified-ads
   ```

2. Backend Setup:
   ```
   cd backend
   npm install
   cp ../.env.example .env
   # Edit .env with your MongoDB URI, JWT secret, and Stripe keys
   npm run dev
   ```

3. Frontend Setup:
   ```
   cd ../frontend
   npm install
   cp ../.env.example .env
   # Edit .env with API URL and Stripe publishable key
   npm start
   ```

4. Open browser to `http://localhost:3000` for frontend, backend runs on `http://localhost:5000`.

### Environment Variables

Copy `.env.example` to `.env` and fill in:
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- `STRIPE_SECRET_KEY`: From Stripe dashboard
- `STRIPE_PUBLISHABLE_KEY`: From Stripe dashboard

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products (with optional search query)
- `POST /api/products` - Create new product (authenticated)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent

## Socket.io Events

- `joinRoom`: Join a chat room (room: userId-sellerId)
- `sendMessage`: Send message in room
- `receiveMessage`: Receive message in room

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and create PR

## License

MIT
