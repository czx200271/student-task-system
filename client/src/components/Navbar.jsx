import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const onAuth = () => setToken(localStorage.getItem('token'));
    window.addEventListener('app:auth-changed', onAuth);
    return () => window.removeEventListener('app:auth-changed', onAuth);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('app:auth-changed'));
    navigate('/login');
    window.location.reload();
  };

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
        {!token ? (
          <>
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>
              Login
            </Link>
            <Link to="/register" className={isActive('/register') ? 'active' : ''}>
              Register
            </Link>
          </>
        ) : (
          <button type="button" className="nav-btn" onClick={logout}>
            Logout
          </button>
        )}
        <button type="button" className="theme-toggle" onClick={toggleTheme} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
