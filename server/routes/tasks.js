const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/tasks/stats - get task statistics for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    const now = new Date();
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      pending: tasks.filter(t => t.status === 'todo').length,
      overdue: tasks.filter(t => {
        if (t.status === 'done') return false;
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < now;
      }).length
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks - get all tasks for current user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description = '', dueDate = null, priority = 'medium', status = 'todo' } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      userId: req.userId,
      title: title.trim(),
      description,
      dueDate,
      priority,
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

    const allowed = ['title', 'description', 'dueDate', 'priority', 'status'];
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

