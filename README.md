# AI Customer Support Assistant

An AI-powered customer support chatbot built with **React**, **Node.js**, **Express**, **MongoDB**, and the **Google Gemini API**.

## Features

- 💬 Responsive chat interface
- 👤 User enters name before starting conversation
- 📜 Chat history displayed during the session
- ⏳ Typing/loading indicator while AI responds
- ⚠️ Clear error messages for failed requests
- 🗄️ Every conversation stored in MongoDB
- 📱 Fully responsive design (mobile-friendly)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| AI Provider | Google Gemini API (`gemini-2.5-flash`) |

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── NamePrompt.jsx
│   │   ├── api/chatApi.js     # API call layer
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   └── package.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   └── Message.js
│   │   ├── routes/chatRoutes.js
│   │   ├── controllers/chatController.js
│   │   ├── services/aiService.js   # Gemini integration
│   │   ├── config/db.js       # MongoDB connection
│   │   ├── middleware/errorHandler.js
│   │   └── app.js             # Server entry point
│   ├── .env.example
│   └── package.json
├── package.json               # Root scripts
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)
- [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <https://github.com/Naveen-mishra11/AI-SUPPORT-ASSISTANT.git>
cd cyvigilant-assignment
```

### 2. Install dependencies

```bash
npm run install-all
```

This installs dependencies for the root, client, and server.

### 3. Configure environment variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### 4. Run the application

**Option A: Run both server and client separately (development)**

Terminal 1 - Start the backend:
```bash
npm run dev:server
```

Terminal 2 - Start the frontend:
```bash
npm run dev:client
```

The frontend runs at `http://localhost:3000` and proxies API requests to the backend at `http://localhost:5000`.

**Option B: Build and run in production mode**

```bash
npm run build
npm start
```

The server serves the built React app at `http://localhost:5000`.

## API Documentation

### Base URL

- Development: `http://localhost:5000/api`
- Production: `https://<your-render-app>.onrender.com/api`

### Health Check

**GET** `/api/health`

Returns server status and timestamp.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Send Chat Message

**POST** `/api/chat`

Sends a user message and returns the AI response. Both messages are stored in MongoDB.

**Request Body:**
```json
{
  "name": "John",
  "message": "How do I reset my password?"
}
```

**Validation Rules:**
- `name` (required): string, 1-50 characters
- `message` (required): string, 1-2000 characters

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "role": "user",
      "content": "How do I reset my password?",
      "createdAt": "2025-01-01T12:00:00.000Z"
    },
    "assistantMessage": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d1",
      "role": "assistant",
      "content": "To reset your password, go to the login page and click 'Forgot Password'...",
      "createdAt": "2025-01-01T12:00:01.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Validation error (missing/invalid fields)
- `502` - AI service unavailable
- `500` - Internal server error

### Get Chat History

**GET** `/api/chat/history`

Fetches all conversation history. Optionally filter by user name.

**Query Parameters:**
- `name` (optional): Filter messages by user name

**Example:**
```
GET /api/chat/history?name=John
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "role": "user",
      "content": "How do I reset my password?",
      "userName": "John",
      "createdAt": "2025-01-01T12:00:00.000Z"
    },
    {
      "id": "65f8a1b2c3d4e5f6a7b8c9d1",
      "role": "assistant",
      "content": "To reset your password, go to the login page...",
      "userName": "John",
      "createdAt": "2025-01-01T12:00:01.000Z"
    }
  ]
}
```

### Delete Message (Optional)

**DELETE** `/api/chat/history/:id`

Deletes a specific message by its ID.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Error Responses:**
- `400` - Missing message ID
- `404` - Message not found

## Data Model Design

The database uses two collections with a simple, readable relationship:

### Users Collection

```javascript
{
  name: String,        // User's name (required, trimmed, max 50 chars)
  createdAt: Date,     // Auto-generated timestamp
  updatedAt: Date      // Auto-generated timestamp
}
```

**Purpose:** Stores unique users identified by name. Users are created on first message if they don't exist.

### Messages Collection

```javascript
{
  user: ObjectId,      // Reference to User collection
  role: String,        // 'user' or 'assistant'
  content: String,     // Message text (required, trimmed)
  createdAt: Date,     // Auto-generated timestamp
  updatedAt: Date      // Auto-generated timestamp
}
```

**Purpose:** Stores every chat message with a reference to the user who sent/received it. The `role` field distinguishes between user messages and AI responses.

### Design Rationale

- **Separation of concerns**: Users and messages are separate collections, making it easy to query all messages for a user or all users.
- **Timestamps**: Mongoose's `timestamps: true` automatically records when each document is created/updated, satisfying the timestamp requirement.
- **Relationship**: The `user` field in Messages is an ObjectId reference to the Users collection, establishing a clear one-to-many relationship (one user → many messages).
- **History retrieval**: Messages are sorted by `createdAt` to reconstruct conversation order.

## AI Integration

This project uses the **Google Gemini API** with the `gemini-2.5-flash` model (free tier).

### How it works

1. The backend receives the user's name and message
2. It fetches recent conversation history for context
3. A system prompt instructs Gemini to act as a customer support assistant for "Cyvigilant"
4. The AI response is stored in MongoDB and returned to the frontend

### Configuration

Set your Gemini API key in the `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).


## Error Handling

The application handles errors gracefully at multiple levels:

- **Frontend**: Displays clear error messages in a dismissible toast notification
- **Backend**: Validates request bodies and returns appropriate HTTP status codes
- **AI Service**: Catches Gemini API failures and returns a friendly error message
- **Database**: Handles connection failures and validation errors

## Made With ❤️ by [Naveen Mishra](https://github.com/Naveen-mishra11)