import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../../styles/App.css';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      <div className={`main-area${collapsed ? ' collapsed' : ''}`}>
        <Navbar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
