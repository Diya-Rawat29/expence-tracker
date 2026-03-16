import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { DollarSign, PlusCircle, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, today } from '../utils/formatters';
import toast from 'react-hot-toast';
import { db } from '../utils/db';

// Simple income managed locally (no separate context for brevity)
export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);

  // Fetch from backend on load
  const [form, setForm] = useState({ source: 'Salary', amount: '', date: today(), notes: '' });

  useEffect(() => {
    fetch('https://expence-tracker-backend-2rub.onrender.com/api/incomes')
      .then(res => res.json())
      .then(data => setIncomes(data))
      .catch(console.error);
  }, []);

  const save = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error('Enter valid amount'); return; }
    const newIncome = { ...form, id: `inc_${Date.now()}`, amount: parseFloat(form.amount), createdAt: new Date().toISOString() };
    try {
      await fetch('https://expence-tracker-backend-2rub.onrender.com/api/incomes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newIncome)
      });
      const updated = [newIncome, ...incomes];
      setIncomes(updated);
      toast.success('Income added!');
      setForm({ source: 'Salary', amount: '', date: today(), notes: '' });
    } catch(err) {
      toast.error('Failed to add income');
    }
  };

  const deleteIncome = async (id) => {
    try {
      await fetch(`https://expence-tracker-backend-2rub.onrender.com/api/incomes/${id}`, { method: 'DELETE' });
      const updated = incomes.filter(i => i.id !== id);
      setIncomes(updated);
      toast.success('Deleted');
    } catch(err) {
      toast.error('Failed to delete income');
    }
  };

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Income Manager</h1>
        <p className="page-subtitle">Total Recorded Income: <strong style={{ color: 'var(--success)' }}>{formatCurrency(total)}</strong></p>
      </div>

      <div className="card" style={{ maxWidth: '600px', marginBottom: '28px' }}>
        <h2 className="card-title" style={{ marginBottom: '16px' }}>Add Income</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Source</label>
            <select className="form-input" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}>
              {['Salary','Freelance','Business','Investment','Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input type="number" className="form-input" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input className="form-input" placeholder="Optional note" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={save}><PlusCircle size={16} /> Add Income</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '20px 24px' }}><h2 className="card-title">Income Records</h2></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Source</th><th>Notes</th><th style={{ textAlign: 'right' }}>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {incomes.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>No income records yet</td></tr>
                : incomes.map(i => (
                  <tr key={i.id}>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(i.date)}</td>
                    <td><span className="badge badge-success">{i.source}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{i.notes || '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(i.amount)}</td>
                    <td><button className="btn-icon danger" onClick={() => deleteIncome(i.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
