# Events API - Node.js Backend

A RESTful API backend for managing events, built with Node.js, Express, and MongoDB. This project uses the native MongoDB driver with a singleton pattern for database connections.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)
  - [Event Object Schema](#event-object-schema)
- [Nudge API](#nudge-api)
- [Error Handling](#error-handling)

---

## ✨ Features

- **Full CRUD Operations** for Events
- **Pagination Support** for listing events
- **Singleton Database Connection** using native MongoDB driver
- **Graceful Shutdown** handling for clean server termination
- **Health Check Endpoint** for monitoring server status
- **Modular Architecture** with separate routes, controllers, and config

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime environment |
| Express | ^5.2.1 | Web framework |
| MongoDB | ^7.0.0 | Native database driver |
| dotenv | ^17.2.3 | Environment variable management |
| nodemon | ^3.1.11 | Development auto-restart (dev dependency) |

---

## 📁 Project Structure

```
DT assignment/
├── config/
│   └── db.js              # MongoDB connection (Singleton pattern)
├── controllers/
│   └── eventController.js # Event CRUD operations logic
├── routes/
│   └── eventRoutes.js     # API route definitions
├── .env                   # Environment variables (not in repo)
├── .gitignore             # Git ignore rules
├── NUDGE_API_DOCS.md      # Nudge API documentation
├── package.json           # Project dependencies and scripts
├── server.js              # Application entry point
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** (local installation or cloud instance like MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd "DT assignment"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=events_db
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `events_db` |
| `NODE_ENV` | Environment mode | `development` |

### Running the Server

**Development mode** (with auto-restart):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

After starting, you should see:

```
✅ Successfully connected to MongoDB
🚀 Server is running on http://localhost:3000
📍 API Base URL: http://localhost:3000/api/v3/app
💚 Health Check: http://localhost:3000/health
```

---

## 📖 API Documentation

### Base URL

```
http://localhost:3000/api/v3/app
```

### Endpoints

#### 1. Get Event by ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/events?id=:event_id` |
| **Description** | Fetches a single event by its MongoDB `_id` |

**Example:**

```bash
curl "http://localhost:3000/api/v3/app/events?id=64f5a6c1e987654321fedcba"
```

**Success Response (200 OK):**

```json
{
    "success": true,
    "data": {
        "_id": "64f5a6c1e987654321fedcba",
        "name": "Tech Conference 2024",
        ...
    }
}
```

---

#### 2. Get Latest Events (Paginated)

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/events?type=latest&limit=:limit&page=:page` |
| **Description** | Fetches events sorted by schedule (descending) with pagination |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | String | No | - | Set to `latest` for sorted results |
| `limit` | Integer | No | `5` | Number of events per page |
| `page` | Integer | No | `1` | Page number |

**Example:**

```bash
curl "http://localhost:3000/api/v3/app/events?type=latest&limit=10&page=1"
```

**Success Response (200 OK):**

```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "currentPage": 1,
        "limit": 10,
        "totalEvents": 50,
        "totalPages": 5
    }
}
```

---

#### 3. Create Event

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Endpoint** | `/events` |
| **Description** | Creates a new event |

**Request Body:**

```json
{
    "name": "Tech Conference 2024",
    "tagline": "Innovation at its best",
    "schedule": "2024-03-15T09:00:00.000Z",
    "description": "Annual technology conference...",
    "moderator": "user123",
    "category": "Technology",
    "sub_category": "AI/ML",
    "rigor_rank": 5,
    "files": { "image": "https://example.com/image.jpg" },
    "attendees": ["user456", "user789"]
}
```

**Success Response (201 Created):**

```json
{
    "success": true,
    "message": "Event created successfully",
    "data": {
        "_id": "64f5a6c1e987654321fedcba"
    }
}
```

---

#### 4. Update Event

| Property | Value |
|----------|-------|
| **Method** | `PUT` |
| **Endpoint** | `/events/:id` |
| **Description** | Updates an existing event by ID |

**Example:**

```bash
curl -X PUT "http://localhost:3000/api/v3/app/events/64f5a6c1e987654321fedcba" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Event Name", "tagline": "New tagline"}'
```

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Event updated successfully",
    "data": {
        "modifiedCount": 1
    }
}
```

---

#### 5. Delete Event

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **Endpoint** | `/events/:id` |
| **Description** | Deletes an event by ID |

**Example:**

```bash
curl -X DELETE "http://localhost:3000/api/v3/app/events/64f5a6c1e987654321fedcba"
```

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Event deleted successfully"
}
```

---

#### 6. Health Check

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Endpoint** | `/health` |
| **Description** | Returns server health status |

**Example:**

```bash
curl "http://localhost:3000/health"
```

**Success Response (200 OK):**

```json
{
    "status": "OK",
    "message": "Server is running",
    "timestamp": "2024-03-15T09:00:00.000Z"
}
```

---

### Event Object Schema

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier (auto-generated) |
| `type` | String | Always set to `"event"` |
| `uid` | String | User ID of the creator |
| `name` | String | Event name (**required**) |
| `tagline` | String | Short event tagline |
| `schedule` | Date | Event date and time |
| `description` | String | Detailed event description |
| `files` | Object | Contains `image` URL |
| `moderator` | String | Moderator user ID |
| `category` | String | Event category |
| `sub_category` | String | Event sub-category |
| `rigor_rank` | Integer | Event rigor ranking (0-10) |
| `attendees` | Array | List of attendee user IDs |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

---

## 📢 Nudge API

The API also supports **Nudges** - notifications or reminders associated with events. For complete Nudge API documentation including endpoints, schemas, and examples, see:

📄 **[NUDGE_API_DOCS.md](./NUDGE_API_DOCS.md)**

---

## ⚠️ Error Handling

All endpoints return consistent error responses:

### 400 Bad Request

```json
{
    "success": false,
    "message": "Invalid Event ID format"
}
```

### 404 Not Found

```json
{
    "success": false,
    "message": "Event not found"
}
```

### 500 Internal Server Error

```json
{
    "success": false,
    "message": "Internal server error",
    "error": "Error details (development mode only)"
}
```

---

## 📝 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Run the server in production mode |
| `dev` | `npm run dev` | Run the server with nodemon (auto-restart) |
| `test` | `npm test` | Run tests (not configured) |

---

## 🔐 Security Notes

- The `.env` file is excluded from version control via `.gitignore`
- Error details are only exposed in development mode
- MongoDB ObjectId validation is performed on all ID parameters

---

## 📄 License

ISC

---

## 👤 Author

*SYED SHUJATULLAH*
