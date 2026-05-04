import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, getToken } from '../utils/api';

// Check whether a task is overdue
function isOverdue(dueDate, status) {
  if (status === 'done') return false;
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function formatDateInputValue(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function formatDueDateDisplay(date) {
  const v = formatDateInputValue(date);
  return v || 'N/A';
}

function Tasks() {
  const [token, setToken] = useState(() => getToken());
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, todo, done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingTask, setEditingTask] = useState(null); // task object (edit only)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const loadTasks = async () => {
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/tasks', { token });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
      priority: 'medium'
    });
  };

  const openEdit = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      dueDate: formatDateInputValue(task.dueDate),
      priority: task.priority || 'medium'
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
        priority: editForm.priority
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

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

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

      <div className="tasks-toolbar">
        <div className="tasks-toolbar-left">
          <button type="button" className="btn" onClick={openCreate}>
            New Task
          </button>
        </div>
        <div className="tasks-toolbar-right">
          <button type="button" className="btn btn-secondary" onClick={loadTasks} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      
      {/* Filter buttons */}
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
      </div>

      {/* Task list */}
      <div className="task-list">
        {tasks.length === 0 && (
          <p className="empty-hint">
            You do not have any tasks yet. Click "New Task" to create one, then you will see "Edit / Delete / Mark Done" on each task card.
          </p>
        )}
        {tasks.length > 0 && filteredTasks.length === 0 && (
          <p className="empty-hint">No tasks match the current filter. Try switching to All / Pending / Completed.</p>
        )}
        {filteredTasks.map(task => (
          <div 
            key={task._id} 
            className={`task-card ${task.status} ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
          >
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`priority ${task.priority}`}>{task.priority}</span>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-footer">
              <span className="due-date">
                Due: {formatDueDateDisplay(task.dueDate)}
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
                  {task.status === 'todo' ? '✓ Mark Done' : '↩ Undo'}
                </button>
              </div>
            </div>
          </div>
        ))}
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
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                />
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
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Save
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
