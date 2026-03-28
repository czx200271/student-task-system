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

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
