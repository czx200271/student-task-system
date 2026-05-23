import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getToken } from '../utils/api';

function formatDueDateShort(date) {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    today: 0,
    tomorrow: 0,
    thisWeek: 0,
    highPriority: 0,
    completionRate: 0,
    subjectCounts: {},
    upcomingTasks: []
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

  const subjectColors = {
    Math: '#667eea',
    English: '#f093fb',
    Programming: '#11998e',
    History: '#f5576c',
    Science: '#4facfe',
    Other: '#95a5a6'
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Dashboard</h1>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty state when no tasks
  if (stats.total === 0) {
    return (
      <div className="page-container">
        <h1>Dashboard</h1>
        <p>Welcome{user ? `, ${user.name}` : ''}! Let's get started.</p>
        
        <div className="empty-dashboard">
          <div className="empty-icon">🎯</div>
          <h2>No tasks yet!</h2>
          <p>Create your first task to start tracking your progress.</p>
          <Link to="/tasks" className="btn">+ Create Your First Task</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container dashboard">
      <h1>Dashboard</h1>
      <p>Welcome back{user ? `, ${user.name}` : ''}! Here's your learning overview:</p>

      {error && <div className="alert error">{error}</div>}

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Overall Progress</h3>
          <span className="progress-percent">{stats.completionRate}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      {/* Quick Stats Grid */}
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
        <div className="stat-card highlight-card">
          <h3>Overdue</h3>
          <p className="stat-number overdue">{stats.overdue}</p>
        </div>
      </div>

      {/* Time-based Overview */}
      <div className="dashboard-section">
        <h2 className="section-title">📅 This Week Overview</h2>
        <div className="week-overview">
          <div className="week-stat">
            <span className="week-stat-label">Due Today</span>
            <span className={`week-stat-value ${stats.today > 0 ? 'highlight' : ''}`}>
              {stats.today}
            </span>
          </div>
          <div className="week-stat">
            <span className="week-stat-label">Due Tomorrow</span>
            <span className="week-stat-value">{stats.tomorrow}</span>
          </div>
          <div className="week-stat">
            <span className="week-stat-label">This Week</span>
            <span className="week-stat-value">{stats.thisWeek}</span>
          </div>
          <div className="week-stat">
            <span className="week-stat-label">High Priority</span>
            <span className={`week-stat-value ${stats.highPriority > 0 ? 'urgent' : ''}`}>
              {stats.highPriority}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(stats.overdue > 0 || stats.highPriority > 0) && (
        <div className="dashboard-alerts">
          {stats.overdue > 0 && (
            <div className="dashboard-alert overdue-alert">
              <span className="alert-icon">⚠️</span>
              <span>You have <strong>{stats.overdue}</strong> overdue task{stats.overdue > 1 ? 's' : ''}!</span>
              <Link to="/tasks" className="alert-link">View Tasks →</Link>
            </div>
          )}
          {stats.highPriority > 0 && (
            <div className="dashboard-alert priority-alert">
              <span className="alert-icon">🔥</span>
              <span><strong>{stats.highPriority}</strong> high priority task{stats.highPriority > 1 ? 's' : ''} pending</span>
              <Link to="/tasks" className="alert-link">View Tasks →</Link>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Tasks */}
      {stats.upcomingTasks && stats.upcomingTasks.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">⏰ Upcoming Tasks</h2>
          <div className="upcoming-tasks">
            {stats.upcomingTasks.map(task => (
              <div key={task._id} className="upcoming-task-card">
                <div className="upcoming-task-info">
                  <span className={`subject-dot ${(task.subject || 'Other').toLowerCase()}`}></span>
                  <span className="upcoming-task-title">{task.title}</span>
                </div>
                <div className="upcoming-task-meta">
                  <span className={`priority-dot ${task.priority}`}></span>
                  <span className="upcoming-task-due">{formatDueDateShort(task.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/tasks" className="view-all-link">View All Tasks →</Link>
        </div>
      )}

      {/* Subject Distribution */}
      {Object.keys(stats.subjectCounts).length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">📚 Tasks by Subject</h2>
          <div className="subject-distribution">
            {Object.entries(stats.subjectCounts).map(([subject, count]) => (
              <div key={subject} className="subject-bar-item">
                <div className="subject-bar-label">
                  <span 
                    className="subject-color-dot" 
                    style={{ background: subjectColors[subject] || '#95a5a6' }}
                  ></span>
                  <span>{subject}</span>
                </div>
                <div className="subject-bar-wrapper">
                  <div 
                    className="subject-bar-fill"
                    style={{ 
                      width: `${(count / stats.total) * 100}%`,
                      background: subjectColors[subject] || '#95a5a6'
                    }}
                  ></div>
                </div>
                <span className="subject-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <Link to="/tasks" className="btn">Go to Tasks</Link>
      </div>
    </div>
  );
}

export default Dashboard;
