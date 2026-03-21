// 假数据 - Week 8 会改成从后端获取
const mockStats = {
  total: 8,
  completed: 3,
  pending: 4,
  overdue: 1
};

function Dashboard() {
  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome back! Here's your task overview:</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{mockStats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number completed">{mockStats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number pending">{mockStats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue</h3>
          <p className="stat-number overdue">{mockStats.overdue}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
