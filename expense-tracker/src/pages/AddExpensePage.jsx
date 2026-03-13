import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useCategories } from '../context/CategoryContext';
import { validateExpense } from '../utils/validators';
import { today } from '../utils/formatters';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '', amount: '', date: today(), category: '',
  paymentMode: 'Cash', notes: '', status: 'approved',
};

export default function AddExpensePage() {
  const { id } = useParams();
  const isEdit = !!id;
  const { addExpense, updateExpense, getById } = useExpenses();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existing = getById(id);
      if (existing) setForm({ ...defaultForm, ...existing, amount: String(existing.amount) });
      else { toast.error('Expense not found'); navigate('/expenses'); }
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: errs } = validateExpense(form);
    if (!isValid) { setErrors(errs); toast.error('Please fix the errors'); return; }
    setLoading(true);
    try {
      if (isEdit) { updateExpense(id, form); toast.success('Expense updated! ✅'); }
      else { addExpense(form); toast.success('Expense added! ✅'); }
      navigate('/expenses');
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button className="btn-icon" onClick={() => navigate('/expenses')}><ArrowLeft size={20} /></button>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Expense' : 'Add New Expense'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update expense details' : 'Fill in the details below'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input name="title" className={`form-input${errors.title ? ' error' : ''}`}
                placeholder="e.g. Team Lunch" value={form.title} onChange={handleChange} />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input name="amount" type="number" step="0.01" min="0"
                className={`form-input${errors.amount ? ' error' : ''}`}
                placeholder="0.00" value={form.amount} onChange={handleChange} />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input name="date" type="date" className={`form-input${errors.date ? ' error' : ''}`}
                value={form.date} onChange={handleChange} />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className={`form-input${errors.category ? ' error' : ''}`}
                value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Mode *</label>
              <select name="paymentMode" className={`form-input${errors.paymentMode ? ' error' : ''}`}
                value={form.paymentMode} onChange={handleChange}>
                {['Cash', 'UPI', 'Card', 'NetBanking'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={form.status} onChange={handleChange}>
                {['approved', 'pending', 'draft', 'rejected'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea name="notes" className="form-input" rows="3"
              placeholder="Any additional notes..." value={form.notes} onChange={handleChange}
              style={{ resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/expenses')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
