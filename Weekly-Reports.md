# Student Task Management System - Weekly Progress Reports

**Project:** Student Task Management System  
**Duration:** 10 Weeks (March - May 2026)  
**Final Submission:** May 24, 2026

---

## Week 1: Project Setup

**Date:** March 9, 2026

### Achievements
| Task | Status |
|------|--------|
| Initialize Git repository | ✅ Completed |
| Set up monorepo structure (`/client` + `/server`) | ✅ Completed |
| Create React frontend with Vite | ✅ Completed |
| Create Express backend | ✅ Completed |
| Implement `/api/health` endpoint | ✅ Completed |
| Write basic `README.md` | ✅ Completed |
| Configure environment variables | ✅ Completed |

### Challenges
- Vite CLI interactive prompts - manually selected options
- First time working with monorepo structure
- Understanding dotenv and environment variables

---

## Week 2: Frontend Routing & Pages

**Date:** March 16, 2026

### Achievements
| Task | Status |
|------|--------|
| Install React Router | ✅ Completed |
| Create Login page | ✅ Completed |
| Create Register page | ✅ Completed |
| Create Dashboard page | ✅ Completed |
| Create Tasks page | ✅ Completed |
| Implement Navbar component | ✅ Completed |
| Add basic CSS styling | ✅ Completed |

### Challenges
- Understanding React Router concepts (BrowserRouter, Routes, Route, Link)
- Implementing active link highlighting with useLocation hook

---

## Week 3: Database Connection

**Date:** March 23, 2026

### Achievements
| Task | Status |
|------|--------|
| Create MongoDB Atlas account | ✅ Completed |
| Connect Express to MongoDB | ✅ Completed |
| Create User model | ✅ Completed |
| Create Task model | ✅ Completed |
| Test database operations | ✅ Completed |

### Challenges
- MongoDB Atlas setup (IP whitelist, connection string)
- Understanding Mongoose schemas and models
- Mongoose pre-save hooks syntax

---

## Week 4: User Authentication

**Date:** March 30, 2026

### Achievements
| Task | Status |
|------|--------|
| Implement user registration | ✅ Completed |
| Password hashing with bcryptjs | ✅ Completed |
| Implement user login | ✅ Completed |
| JWT token generation | ✅ Completed |
| Create auth middleware | ✅ Completed |
| GET /api/auth/me endpoint | ✅ Completed |

### Challenges
- Understanding JWT authentication flow
- Implementing auth middleware for protected routes
- Postman setup for API testing

---

## Week 5: Tasks CRUD API

**Date:** April 6, 2026

### Achievements
| Task | Status |
|------|--------|
| GET /api/tasks | ✅ Completed |
| POST /api/tasks | ✅ Completed |
| PUT /api/tasks/:id | ✅ Completed |
| DELETE /api/tasks/:id | ✅ Completed |
| PATCH /api/tasks/:id/status | ✅ Completed |
| Jest unit tests | ✅ Completed |

### Challenges
- Validating ObjectId parameters
- Implementing proper error handling
- Writing meaningful unit tests

---

## Week 6: Frontend-Backend Integration

**Date:** April 13, 2026

### Achievements
| Task | Status |
|------|--------|
| Connect Login page to API | ✅ Completed |
| Connect Register page to API | ✅ Completed |
| Connect Tasks page to API | ✅ Completed |
| Token storage in localStorage | ✅ Completed |
| Loading states and error handling | ✅ Completed |
| Create/Edit/Delete task UI | ✅ Completed |

### Challenges
- Managing authentication state across components
- Handling API errors gracefully
- Implementing optimistic UI updates

---

## Week 7: Route Protection & Dashboard

**Date:** April 20, 2026

### Achievements
| Task | Status |
|------|--------|
| Create ProtectedRoute component | ✅ Completed |
| Protect Dashboard and Tasks routes | ✅ Completed |
| GET /api/tasks/stats endpoint | ✅ Completed |
| Real statistics on Dashboard | ✅ Completed |
| User name display | ✅ Completed |

### Challenges
- Port conflict (EADDRINUSE) - killed process with taskkill
- Implementing route protection logic

---

## Week 8: Deployment

**Date:** May 18, 2026

### Achievements
| Task | Status |
|------|--------|
| Push code to GitHub | ✅ Completed |
| Deploy backend to Render | ✅ Completed |
| Deploy frontend to Vercel | ✅ Completed |
| Configure environment variables | ✅ Completed |
| CI/CD pipeline established | ✅ Completed |

### Challenges
- Connecting GitHub to Render (authorization)
- Selecting correct Vercel plan (Hobby vs Pro)
- Configuring VITE_API_BASE_URL for production

---

## Week 9-10: UI Enhancement & New Features (Final Week)

**Date:** May 24, 2026

### Achievements
| Task | Status |
|------|--------|
| Modern UI redesign | ✅ Completed |
| Subject/Course categories | ✅ Completed |
| Search functionality | ✅ Completed |
| Sort options | ✅ Completed |
| Due date grouping | ✅ Completed |
| Enhanced Dashboard | ✅ Completed |
| Progress bar | ✅ Completed |
| Upcoming tasks section | ✅ Completed |
| Subject distribution chart | ✅ Completed |
| Mobile responsiveness | ✅ Completed |
| Documentation update | ✅ Completed |

### Challenges
- Port conflict resolution
- Data compatibility for old tasks without subject field
- Date grouping timezone handling
- Mobile responsive design

---

## Final Deliverables

| Type | URL |
|------|-----|
| **Live Application** | https://student-task-system.vercel.app |
| **Backend API** | https://student-task-system.onrender.com |
| **Source Code** | https://github.com/czx200271/student-task-system |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Token) |
| Deployment | Vercel (Frontend), Render (Backend) |
| Version Control | Git, GitHub |

---

## Post-Project Updates

**Date:** May 31, 2026

### New Features Added

| Feature | Status |
|---------|--------|
| Dark/Light Mode Toggle | ✅ Completed |
| Task Attachments | ✅ Completed |
| Code Quality Polish | ✅ Completed |

### Feature Details

#### 1. Dark/Light Mode Toggle 🌙☀️
- Added theme toggle button in navigation bar
- Click 🌙 to switch to dark mode
- Click ☀️ to switch to light mode
- User preference saved in localStorage
- Full dark mode styling for all components

#### 2. Task Attachments 📎
- Users can upload files when creating/editing tasks
- Supports images and documents (max 5MB per file)
- Attachment thumbnails displayed on task cards
- Click image to view full-screen preview
- Easy attachment removal

### Technical Implementation
- Theme state managed in Navbar component with localStorage persistence
- Attachments stored as base64 in MongoDB
- Increased Express body limit to 10MB for file uploads
- Added comprehensive dark mode CSS styles

---

## Project Conclusion

The Student Task Management System has been successfully completed over 10 weeks, with additional features added post-completion. The application is fully functional and deployed to production. Users can:

- Register and login with secure authentication
- Create, edit, delete, and manage tasks
- Categorize tasks by subject (Math, English, Programming, etc.)
- Search and filter tasks
- Sort by due date, priority, or creation time
- View tasks grouped by deadline (Today, Tomorrow, This Week, etc.)
- Track progress with completion statistics and charts
- **Switch between dark and light themes**
- **Attach files and images to tasks**

The project demonstrates full-stack development skills including React, Node.js, Express, MongoDB, JWT authentication, and cloud deployment.

---

*End of Weekly Reports*
