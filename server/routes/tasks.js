const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// GET /api/tasks/stats - get enhanced task statistics for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfTomorrow = endOfDay(tomorrow);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const pendingTasks = tasks.filter(t => t.status === 'todo');
    const completedTasks = tasks.filter(t => t.status === 'done');
    
    const overdueTasks = pendingTasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < today;
    });

    const todayTasks = pendingTasks.filter(t => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= today && due < tomorrow;
    });

    const tomorrowTasks = pendingTasks.filter(t => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= tomorrow && due <= endOfTomorrow;
    });

    const thisWeekTasks = pendingTasks.filter(t => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= today && due <= endOfWeek;
    });

    const highPriorityPending = pendingTasks.filter(t => t.priority === 'high');

    // Subject distribution
    const subjectCounts = {};
    tasks.forEach(t => {
      const subj = t.subject || 'Other';
      subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
    });

    // Upcoming tasks (next 5 due soon, not overdue)
    const upcomingTasks = pendingTasks
      .filter(t => t.dueDate && new Date(t.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const stats = {
      total: tasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      overdue: overdueTasks.length,
      today: todayTasks.length,
      tomorrow: tomorrowTasks.length,
      thisWeek: thisWeekTasks.length,
      highPriority: highPriorityPending.length,
      completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
      subjectCounts,
      upcomingTasks
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks - get all tasks with search, filter, sort
router.get('/', auth, async (req, res) => {
  try {
    const { search, subject, sort } = req.query;
    
    let query = { userId: req.userId };
    
    // Search in title, description, subject
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex }
      ];
    }
    
    // Filter by subject
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    // Build sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'dueDate') {
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1, createdAt: -1 };
    } else if (sort === 'created') {
      sortOption = { createdAt: -1 };
    }
    
    const tasks = await Task.find(query).sort(sortOption);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      description = '', 
      dueDate = null, 
      priority = 'medium', 
      subject = 'Other',
      status = 'todo' 
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      userId: req.userId,
      title: title.trim(),
      description,
      dueDate,
      priority,
      subject,
      status
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/tasks/:id - update an existing task
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const allowed = ['title', 'description', 'dueDate', 'priority', 'subject', 'status'];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        task[key] = req.body[key];
      }
    }

    if (!task.title || typeof task.title !== 'string' || !task.title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    task.title = task.title.trim();

    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Task.deleteOne({ _id: id });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/tasks/:id/status - toggle task status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    task.status = task.status === 'todo' ? 'done' : 'todo';
    await task.save();

    res.json({ message: 'Task status updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
