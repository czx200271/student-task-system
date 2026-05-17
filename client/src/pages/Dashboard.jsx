import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getToken } from '../utils/api';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await apiFetch('/api/tasks/stats', { token });
        setStats(data.stats);
      } catch (err) {
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Welcome back{user ? `, ${user.name}` : ''}! Here's your task overview:</p>

      {error && <div className="alert error">{error}</div>}
      
      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number completed">{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number pending">{stats.pending}</p>
          </div>
          <div className="stat-card">
            <h3>Overdue</h3>
            <p className="stat-number overdue">{stats.overdue}</p>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <Link to="/tasks" className="btn">Go to Tasks</Link>
      </div>
    </div>
  );
}

export default Dashboard;
