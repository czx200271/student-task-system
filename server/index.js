// Load environment variables (must be first)
require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

// Connect to database
connectDB();

// Read port from env, default 4000
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
