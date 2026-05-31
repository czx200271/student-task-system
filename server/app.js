const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// ========== Test endpoints (Week 3 demo, development only) ==========
if (process.env.NODE_ENV !== 'production') {
  const User = require('./models/User');
  const Task = require('./models/Task');

  app.get('/api/test/create-user', async (req, res) => {
    try {
      const testUser = new User({
        name: 'Test Student',
        email: 'test@example.com',
        passwordHash: 'fake-hash-123'
      });
      const savedUser = await testUser.save();
      res.json({
        message: 'User created successfully!',
        user: savedUser
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/test/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json({
        message: `Found ${users.length} users`,
        users
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/test/create-task', async (req, res) => {
    try {
      const user = await User.findOne();
      if (!user) {
        return res.status(400).json({ error: 'Please create a user first: /api/test/create-user' });
      }

      const testTask = new Task({
        userId: user._id,
        title: 'Complete Week 3 Report',
        description: 'Write progress report for the professor',
        dueDate: new Date('2026-03-30'),
        priority: 'high',
        status: 'todo'
      });
      const savedTask = await testTask.save();
      res.json({
        message: 'Task created successfully!',
        task: savedTask
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/test/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json({
        message: `Found ${tasks.length} tasks`,
        tasks
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
}
// ========== End test endpoints ==========

module.exports = app;
