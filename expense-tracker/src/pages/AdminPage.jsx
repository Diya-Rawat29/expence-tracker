import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { db } from '../utils/db';
import { Shield, Users, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { users, dispatch: authDispatch } = useAuth();
  const { expenses } = useExpenses();

  const handleDeactivate = (id) => {
    if (window.confirm('Deactivate this user?')) {
      authDispatch({ type: 'DEACTIVATE_USER', payload: id });
      authDispatch({ type: 'UPDATE_USERS_IN_STORAGE' });
      toast.success('User deactivated');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Shield size={28} color="var(--primary)" />
        <div><h1 className="page-title">Admin Panel</h1><p className="page-subtitle">System management and oversight</p></div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Total Users', value: users.length, icon: <Users size={24} color="#6C63FF" /> },
          { label: 'Total Expenses', value: expenses.length, icon: <Shield size={24} color="#2EC4B6" /> },
          { label: 'Total Amount', value: formatCurrency(expenses.reduce((s, e) => s + e.amount, 0)), icon: <Download size={24} color="#FF6584" /> },
        ].map(s => (
          <div className="card" key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {s.icon}
            <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{s.label}</div><div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">User Management</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => { db.exportAll(); toast.success('Backup downloaded!'); }}><Download size={14} /> Backup All Data</button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'manager' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-default'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatDate(u.createdAt)}</td>
                  <td>{u.isActive && <button className="btn-icon danger" onClick={() => handleDeactivate(u.id)} title="Deactivate"><Trash2 size={14} /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2 className="card-title">Danger Zone</h2></div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Reset ALL data? This cannot be undone!')) { db.clearAll(); window.location.reload(); } }}>
            Reset All Data
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { db.exportAll(); toast.success('Full backup downloaded!'); }}>
            <Download size={14} /> Full JSON Backup
          </button>
        </div>
      </div>
    </div>
  );
}
