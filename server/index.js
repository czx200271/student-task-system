// 加载环境变量（必须放在最前面）
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 连接数据库
connectDB();

// 创建 Express 应用
const app = express();

// 从环境变量读取端口，默认 4000
const PORT = process.env.PORT || 4000;

// 中间件
app.use(cors());           // 允许跨域请求
app.use(express.json());   // 解析 JSON 请求体

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// 路由
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ========== 测试接口（Week 3 演示用）==========
const User = require('./models/User');
const Task = require('./models/Task');

// 测试：创建一个用户
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

// 测试：查看所有用户
app.get('/api/test/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      message: `Found ${users.length} users`,
      users: users
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 测试：创建一个任务
app.get('/api/test/create-task', async (req, res) => {
  try {
    // 先找一个用户
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

// 测试：查看所有任务
app.get('/api/test/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({
      message: `Found ${tasks.length} tasks`,
      tasks: tasks
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// ========== 测试接口结束 ==========

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
