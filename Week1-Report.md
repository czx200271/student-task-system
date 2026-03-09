# Week 1 Progress Report

**Project:** Student Task Management System  
**Date:** March 9, 2026  
**Student:** [你的名字]

---

## 1. Achievements This Week

### Planned vs Achieved

| Planned Task | Status | Notes |
|--------------|--------|-------|
| Initialize Git repository | ✅ Completed | Repository created with proper `.gitignore` file |
| Set up monorepo structure (`/client` + `/server`) | ✅ Completed | Both folders created and organized |
| Create React frontend with Vite | ✅ Completed | React app running at `http://localhost:5173` |
| Create Express backend | ✅ Completed | Express server running at `http://localhost:4000` |
| Implement `/api/health` endpoint | ✅ Completed | Returns `{"status":"ok","message":"Server is running!"}` |
| Write basic `README.md` | ✅ Completed | Includes project structure and startup instructions |
| Configure environment variables | ✅ Completed | `.env` and `.env.example` files created |

### Summary

All Week 1 tasks were completed as planned. The project skeleton is now ready with both frontend and backend applications running independently.

### Technical Details

- **Frontend:** React 18 + Vite 7, running on port 5173
- **Backend:** Node.js + Express 4, running on port 4000
- **Project Structure:**
  ```
  /student-task-system
    ├── client/     (React frontend)
    ├── server/     (Express backend)
    ├── README.md
    └── .gitignore
  ```

---

## 2. Challenges Encountered and Solutions

### Challenge 1: Vite CLI Interactive Prompts
- **Problem:** The Vite CLI showed interactive prompts instead of using the `--template react` flag directly.
- **Solution:** Manually selected "React" → "JavaScript" → "No" (declined beta version) through the interactive menu.

### Challenge 2: Understanding Monorepo Structure
- **Problem:** First time working with separated frontend and backend in the same project.
- **Solution:** Learned that `/client` handles the user interface and `/server` handles API logic. They communicate via HTTP requests on different ports.

### Challenge 3: Setting Up Node.js Server
- **Problem:** First experience with Express framework and environment variables.
- **Solution:** Used `dotenv` package for environment variables and `cors` package for handling cross-origin requests. Created `.env.example` as a template for other developers.

### Challenge 4: Understanding Configuration Files
- **Problem:** Unclear about the purpose of `.gitignore` and `.env` files.
- **Solution:** Learned that `.gitignore` prevents sensitive or unnecessary files from being uploaded to GitHub, while `.env` stores secret configuration values locally.

---

## 3. Plan for Next Week (Week 2)

| Task | Description | Priority |
|------|-------------|----------|
| Install React Router | Enable navigation between different pages | High |
| Create Login page (`/login`) | Form with email and password input fields | High |
| Create Register page (`/register`) | Form with name, email, and password fields | High |
| Create Dashboard page (`/dashboard`) | Placeholder page for future task statistics | Medium |
| Create Tasks page (`/tasks`) | Display a list of tasks using mock data | High |
| Implement navigation | Add links/buttons to move between pages | High |
| Style basic layout | Simple CSS for readable interface | Low |

### Week 2 Goals
1. Complete all four main pages (Login, Register, Dashboard, Tasks)
2. Implement React Router for page navigation
3. Use mock/fake data to display sample tasks

---

## 4. AI Conversation Links

| Tool Used | Purpose | Reference |
|-----------|---------|-----------|
| Cursor AI (Claude) | Project setup guidance, code generation | Week 1 conversation stored in Cursor IDE |

**Note:** This project uses Cursor AI assistant (powered by Claude) instead of ChatGPT. Conversations are stored locally within the Cursor IDE environment.

---

## Screenshots

[在这里插入截图]

1. Frontend running (http://localhost:5173)
2. Backend health check response (http://localhost:4000/api/health)
3. Project folder structure

---

*End of Week 1 Report*
