const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  dueDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  subject: {
    type: String,
    enum: ['Math', 'English', 'Programming', 'History', 'Science', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['todo', 'done'],
    default: 'todo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt on every save
taskSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Task', taskSchema);
