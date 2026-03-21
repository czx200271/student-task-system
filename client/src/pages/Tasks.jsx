import { useState } from 'react';

// 假数据 - Week 6 会改成从后端获取
const initialTasks = [
  {
    _id: '1',
    title: 'Complete React tutorial',
    description: 'Finish the official React documentation',
    dueDate: '2026-03-15',
    priority: 'high',
    status: 'todo'
  },
  {
    _id: '2',
    title: 'Setup MongoDB Atlas',
    description: 'Create a free cluster and get connection string',
    dueDate: '2026-03-10',
    priority: 'high',
    status: 'done'
  },
  {
    _id: '3',
    title: 'Write project report',
    description: 'Weekly progress report for Week 2',
    dueDate: '2026-03-08',
    priority: 'medium',
    status: 'todo'
  },
  {
    _id: '4',
    title: 'Review JavaScript basics',
    description: 'Review ES6 features',
    dueDate: '2026-03-20',
    priority: 'low',
    status: 'todo'
  }
];

// 判断是否逾期
function isOverdue(dueDate, status) {
  if (status === 'done') return false;
  return new Date(dueDate) < new Date();
}

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all'); // all, todo, done

  // 切换任务状态
  const toggleStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task._id === id) {
        return {
          ...task,
          status: task.status === 'todo' ? 'done' : 'todo'
        };
      }
      return task;
    }));
  };

  // 筛选任务
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="page-container">
      <h1>My Tasks</h1>
      
      {/* 筛选按钮 */}
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

      {/* 任务列表 */}
      <div className="task-list">
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
                Due: {task.dueDate}
                {isOverdue(task.dueDate, task.status) && <span className="overdue-tag"> (Overdue!)</span>}
              </span>
              <button 
                className={`status-btn ${task.status}`}
                onClick={() => toggleStatus(task._id)}
              >
                {task.status === 'todo' ? '✓ Mark Done' : '↩ Undo'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
