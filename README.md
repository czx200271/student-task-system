# Student Task Management System

A full-stack web application that helps students manage their tasks efficiently.

## Live Demo

- **Frontend**: https://student-task-system.vercel.app
- **Backend API**: https://student-task-system.onrender.com

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Set task priority (low, medium, high)
- Set due dates and track overdue tasks
- Filter tasks by status (All, Pending, Completed)
- Dashboard with real-time statistics
- Route protection for authenticated users
- Responsive design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Token) |
| Deployment | Vercel (Frontend), Render (Backend) |

## Project Structure

```
/student-task-system
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── utils/          # API utilities
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/stats | Get task statistics |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/status | Toggle task status |

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/czx200271/student-task-system.git
cd student-task-system
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Environment Variables

### Backend (server/.env)
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (client/.env)
```
VITE_API_BASE_URL=http://localhost:4000
```

## Author

Created as a 10-week personal project for learning full-stack web development.

## License

MIT
