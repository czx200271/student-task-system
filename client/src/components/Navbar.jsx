import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  // 判断当前路径是否激活
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">📚 Student Tasks</Link>
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/tasks" className={isActive('/tasks') ? 'active' : ''}>
          Tasks
        </Link>
        <Link to="/login" className={isActive('/login') ? 'active' : ''}>
          Login
        </Link>
        <Link to="/register" className={isActive('/register') ? 'active' : ''}>
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
