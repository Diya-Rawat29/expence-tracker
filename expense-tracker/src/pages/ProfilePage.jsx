import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { currentUser, dispatch } = useAuth();
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', currency: currentUser?.currency || 'INR' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    dispatch({ type: 'UPDATE_PROFILE', payload: { ...currentUser, ...form } });
    toast.success('Profile updated!');
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '24px' }}>Profile Settings</h1>
      <div className="card" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {form.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{form.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{currentUser?.email}</div>
            <span className="badge badge-info" style={{ marginTop: '6px' }}>{currentUser?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email (read-only)</label>
            <input className="form-input" value={form.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-input" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
              {['INR','USD','EUR','GBP','AED'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary"><Save size={16} /> Save Changes</button>
        </form>
      </div>
    </div>
  );
}
