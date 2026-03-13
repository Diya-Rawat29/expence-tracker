import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, PlusCircle, Wallet, Tags,
  BarChart3, Bell, User, LogOut, ChevronLeft, ChevronRight,
  DollarSign, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/expenses',     label: 'Expenses',    icon: Receipt },
  { to: '/expenses/add', label: 'Add Expense', icon: PlusCircle },
  { to: '/income',       label: 'Income',      icon: DollarSign },
  { to: '/budget',       label: 'Budget',      icon: Wallet },
  { to: '/categories',   label: 'Categories',  icon: Tags },
  { to: '/reports',      label: 'Reports',     icon: BarChart3 },
  { to: '/notifications',label: 'Notifications',icon: Bell },
  { to: '/profile',      label: 'Profile',     icon: User },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <TrendingUp size={20} />
        </div>
        <span className="sidebar-app-name">ExpenseTracker</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">MAIN MENU</div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? label : ''}
            end={to === '/dashboard'}
          >
            <Icon size={18} />
            <span className="nav-label">{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span className="notif-badge" style={{ position: 'static', marginLeft: 'auto' }}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item w-full" onClick={handleLogout} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
          <LogOut size={18} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
