import { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useExpenses } from '../context/ExpenseContext';
import { useCategories } from '../context/CategoryContext';
import { formatCurrency, currentMonth } from '../utils/formatters';
import { Wallet, PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BudgetPage() {
  const { budgets, setBudget, deleteBudget } = useBudget();
  const { expenses } = useExpenses();
  const { categories } = useCategories();
  const month = currentMonth();
  const [form, setForm] = useState({ categoryId: '', limitAmount: '' });

  const thisMonthBudgets = useMemo(() => budgets.filter(b => b.monthYear === month), [budgets, month]);

  const getSpent = (catId) => expenses.filter(e => e.category === catId && e.date?.startsWith(month)).reduce((s, e) => s + e.amount, 0);

  const handleSave = () => {
    if (!form.categoryId || !form.limitAmount || parseFloat(form.limitAmount) <= 0) {
      toast.error('Please select category and enter a valid amount'); return;
    }
    setBudget(form.categoryId, month, form.limitAmount, 'current-user');
    toast.success('Budget set!');
    setForm({ categoryId: '', limitAmount: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Budget Management</h1>
        <p className="page-subtitle">Set monthly budgets per category — get alerted when you overspend.</p>
      </div>

      {/* Add Budget */}
      <div className="card" style={{ marginBottom: '24px', maxWidth: '580px' }}>
        <h2 className="card-title" style={{ marginBottom: '16px' }}>Set Budget for {month}</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select className="form-input" style={{ flex: '1 1 200px' }} value={form.categoryId}
            onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" className="form-input" style={{ flex: '1 1 160px' }} placeholder="Limit (₹)"
            value={form.limitAmount} onChange={e => setForm(p => ({ ...p, limitAmount: e.target.value }))} />
          <button className="btn btn-primary" onClick={handleSave}><PlusCircle size={16} /> Set Budget</button>
        </div>
      </div>

      {/* Budget Cards */}
      {thisMonthBudgets.length === 0
        ? <div className="card empty-state"><Wallet size={40} /><p>No budgets set for {month}.<br />Add one above to start tracking!</p></div>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {thisMonthBudgets.map(b => {
            const cat = categories.find(c => c.id === b.categoryId);
            const spent = getSpent(b.categoryId);
            const pct = Math.min((spent / b.limitAmount) * 100, 100);
            const barClass = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'safe';
            return (
              <div className="card" key={b.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: cat?.color || '#ccc', display: 'inline-block' }} />
                    <span style={{ fontWeight: 600 }}>{cat?.name || 'Unknown'}</span>
                  </div>
                  <button className="btn-icon danger" onClick={() => { deleteBudget(b.id); toast.success('Budget removed'); }}><Trash2 size={14} /></button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <span>Spent: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(spent)}</strong></span>
                  <span>Limit: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(b.limitAmount)}</strong></span>
                </div>
                <div className="progress-bar-wrap">
                  <div className={`progress-bar-fill ${barClass}`} style={{ width: `${pct}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{pct.toFixed(0)}% used</span>
                  {pct >= 100 && <span style={{ color: 'var(--danger)', fontWeight: 600 }}>⚠️ Over Budget!</span>}
                  {pct >= 80 && pct < 100 && <span style={{ color: 'var(--warning)', fontWeight: 600 }}>⚡ Near Limit</span>}
                </div>
              </div>
            );
          })}
        </div>}
    </div>
  );
}
