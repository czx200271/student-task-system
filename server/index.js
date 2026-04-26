// 加载环境变量（必须放在最前面）
require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

// 连接数据库
connectDB();

// 从环境变量读取端口，默认 4000
const PORT = process.env.PORT || 4000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
