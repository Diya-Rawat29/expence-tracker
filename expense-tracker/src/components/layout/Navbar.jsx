import { useLocation } from 'react-router-dom';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useState } from 'react';

const pageTitles = {
  '/dashboard':    'Dashboard',
  '/expenses':     'Expenses',
  '/expenses/add': 'Add Expense',
  '/income':       'Income',
  '/budget':       'Budget',
  '/categories':   'Categories',
  '/reports':      'Reports & Analytics',
  '/notifications':'Notifications',
  '/profile':      'Profile Settings',
  '/admin':        'Admin Panel',
};

export default function Navbar({ onToggle }) {
  const { currentUser, dispatch } = useAuth();
  const { unreadCount } = useNotifications();
  const { pathname } = useLocation();
  const [dark, setDark] = useState(true);

  const title = pageTitles[pathname] || (pathname.includes('/edit') ? 'Edit Expense' : 'ExpenseTracker Pro');

  const toggleTheme = () => {
    setDark(p => !p);
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  };

  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="navbar">
      <button className="sidebar-toggle" onClick={onToggle} title="Toggle Sidebar">
        <Menu size={20} />
      </button>
      <h1 className="navbar-title">{title}</h1>
      <div className="navbar-actions">
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="notif-btn">
          <button className="btn-icon">
            <Bell size={18} />
          </button>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </div>
        <div className="user-menu">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{currentUser?.name || 'User'}</div>
            <div className="user-role">{currentUser?.role || 'employee'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
