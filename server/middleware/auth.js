const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 从 header 获取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, please login' });
    }

    // 提取 token（去掉 "Bearer " 前缀）
    const token = authHeader.split(' ')[1];

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 把 userId 存到 req 上，供后续使用
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token, please login again' });
  }
};

module.exports = auth;
