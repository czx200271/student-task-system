import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getToken } from '../utils/api';

const SUBJECTS = ['Math', 'English', 'Programming', 'History', 'Science', 'Other'];

function isOverdue(dueDate, status) {
  if (status === 'done') return false;
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function formatDateInputValue(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function formatDueDateDisplay(date) {
  if (!date) return 'No due date';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'No due date';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getDateGroup(dueDate, status) {
  if (!dueDate || status === 'done') return null;
  
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  
  due.setHours(0, 0, 0, 0);
  
  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'today';
  if (due.getTime() === tomorrow.getTime()) return 'tomorrow';
  if (due <= endOfWeek) return 'thisWeek';
  return 'later';
}

function Tasks() {
  const [token, setToken] = useState(() => getToken());
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalMode, setModalMode] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    subject: 'Other'
  });

  const loadTasks = async () => {
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (subjectFilter !== 'all') params.set('subject', subjectFilter);
      if (sortBy) params.set('sort', sortBy);
      
      const url = `/api/tasks${params.toString() ? '?' + params.toString() : ''}`;
      const data = await apiFetch(url, { token });
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onAuth = () => setToken(getToken());
    window.addEventListener('app:auth-changed', onAuth);
    return () => window.removeEventListener('app:auth-changed', onAuth);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [token, subjectFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) loadTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleStatus = async (task) => {
    try {
      const data = await apiFetch(`/api/tasks/${task._id}/status`, {
        method: 'PATCH',
        token
      });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const deleteTask = async (task) => {
    const ok = window.confirm(`Delete task "${task.title}"?`);
    if (!ok) return;

    try {
      await apiFetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
        token
      });
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const openCreate = () => {
    setModalMode('create');
    setEditingTask(null);
    setEditForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      subject: 'Other'
    });
  };

  const openEdit = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      dueDate: formatDateInputValue(task.dueDate),
      priority: task.priority || 'medium',
      subject: task.subject || 'Other'
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingTask(null);
  };

  const saveTaskModal = async (e) => {
    e.preventDefault();
    if (!modalMode) return;
    try {
      const payload = {
        title: editForm.title,
        description: editForm.description,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null,
        priority: editForm.priority,
        subject: editForm.subject
      };

      if (modalMode === 'create') {
        const data = await apiFetch('/api/tasks', {
          method: 'POST',
          token,
          body: payload
        });
        setTasks((prev) => [data.task, ...prev]);
        closeModal();
        return;
      }

      if (modalMode === 'edit' && editingTask) {
        const data = await apiFetch(`/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          token,
          body: payload
        });
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? data.task : t)));
        closeModal();
      }
    } catch (err) {
      alert(err.message || 'Failed to save task');
    }
  };

  // Filter by status
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'overdue') return isOverdue(task.dueDate, task.status);
      return task.status === filter;
    });
  }, [tasks, filter]);

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const groups = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      done: [],
      noDue: []
    };

    filteredTasks.forEach(task => {
      if (task.status === 'done') {
        groups.done.push(task);
      } else if (!task.dueDate) {
        groups.noDue.push(task);
      } else {
        const group = getDateGroup(task.dueDate, task.status);
        if (group && groups[group]) {
          groups[group].push(task);
        }
      }
    });

    return groups;
  }, [filteredTasks]);

  const renderTaskCard = (task) => (
    <div 
      key={task._id} 
      className={`task-card ${task.status} ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span className={`subject-badge ${(task.subject || 'Other').toLowerCase()}`}>
            {task.subject || 'Other'}
          </span>
          <span className={`priority ${task.priority}`}>{task.priority}</span>
        </div>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-footer">
        <span className="due-date">
          {formatDueDateDisplay(task.dueDate)}
          {isOverdue(task.dueDate, task.status) && <span className="overdue-tag"> (Overdue!)</span>}
        </span>
        <div className="task-actions">
          <button type="button" className="action-btn" onClick={() => openEdit(task)}>
            Edit
          </button>
          <button type="button" className="action-btn action-danger" onClick={() => deleteTask(task)}>
            Delete
          </button>
          <button 
            type="button"
            className={`status-btn ${task.status}`}
            onClick={() => toggleStatus(task)}
          >
            {task.status === 'todo' ? '✓ Done' : '↩ Undo'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTaskGroup = (title, tasks, icon, className = '') => {
    if (tasks.length === 0) return null;
    return (
      <div className={`task-group ${className}`}>
        <h3 className="task-group-title">
          <span className="task-group-icon">{icon}</span>
          {title}
          <span className="task-group-count">{tasks.length}</span>
        </h3>
        <div className="task-group-list">
          {tasks.map(renderTaskCard)}
        </div>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="page-container">
        <h1>My Tasks</h1>
        <p>
          You are not logged in yet. Please <Link to="/login">log in</Link> to view and edit tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Tasks</h1>

      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="tasks-toolbar-left">
          <button type="button" className="btn" onClick={openCreate}>
            + New Task
          </button>
        </div>
        <div className="tasks-toolbar-right">
          <button type="button" className="btn btn-secondary" onClick={loadTasks} disabled={loading}>
            {loading ? 'Loading...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="tasks-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>Subject:</label>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
              <option value="all">All Subjects</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created">Newest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      
      {/* Status Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button 
          className={filter === 'todo' ? 'active' : ''} 
          onClick={() => setFilter('todo')}
        >
          Pending ({tasks.filter(t => t.status === 'todo').length})
        </button>
        <button 
          className={filter === 'done' ? 'active' : ''} 
          onClick={() => setFilter('done')}
        >
          Completed ({tasks.filter(t => t.status === 'done').length})
        </button>
        <button 
          className={`${filter === 'overdue' ? 'active' : ''} overdue-btn`} 
          onClick={() => setFilter('overdue')}
        >
          Overdue ({tasks.filter(t => isOverdue(t.dueDate, t.status)).length})
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {loading && <p className="loading-hint">Loading tasks...</p>}
        
        {!loading && tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
            <button className="btn" onClick={openCreate}>+ Create Task</button>
          </div>
        )}
        
        {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
          <p className="empty-hint">No tasks match your filters.</p>
        )}

        {!loading && filter !== 'done' && (
          <>
            {renderTaskGroup('Overdue', groupedTasks.overdue, '🔴', 'overdue-group')}
            {renderTaskGroup('Today', groupedTasks.today, '📅', 'today-group')}
            {renderTaskGroup('Tomorrow', groupedTasks.tomorrow, '📆')}
            {renderTaskGroup('This Week', groupedTasks.thisWeek, '📋')}
            {renderTaskGroup('Later', groupedTasks.later, '📁')}
            {renderTaskGroup('No Due Date', groupedTasks.noDue, '📌')}
          </>
        )}
        
        {!loading && filter === 'done' && (
          renderTaskGroup('Completed', groupedTasks.done, '✅', 'done-group')
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'New Task' : 'Edit Task'}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="modal-body" onSubmit={saveTaskModal}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Enter description (optional)"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={editForm.subject}
                  onChange={(e) => setEditForm((p) => ({ ...p, subject: e.target.value }))}
                >
                  {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm((p) => ({ ...p, dueDate: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm((p) => ({ ...p, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {modalMode === 'create' ? 'Create Task' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
