import { useState } from 'react';
import { useCategories } from '../context/CategoryContext';
import { Pencil, Trash2, PlusCircle, Tags } from 'lucide-react';
import toast from 'react-hot-toast';

const ICONS = ['UtensilsCrossed','Car','HeartPulse','Home','GraduationCap','ShoppingBag','Film','Briefcase','Smartphone','MoreHorizontal','Gift','Plane'];
const COLORS = ['#FF6384','#36A2EB','#FF9F40','#4BC0C0','#9966FF','#F7464A','#FFCD56','#2EC4B6','#E91E63','#607D8B'];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [form, setForm] = useState({ name: '', icon: 'Tags', color: '#6C63FF' });
  const [editing, setEditing] = useState(null);

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Category name required'); return; }
    if (editing) { updateCategory(editing, form); toast.success('Category updated'); setEditing(null); }
    else { addCategory(form); toast.success('Category added'); }
    setForm({ name: '', icon: 'Tags', color: '#6C63FF' });
  };

  const handleEdit = (cat) => { setEditing(cat.id); setForm({ name: cat.name, icon: cat.icon, color: cat.color }); };
  const handleDelete = (id) => { if (window.confirm('Delete this category?')) { deleteCategory(id); toast.success('Deleted'); } };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Category Management</h1>
        <p className="page-subtitle">{categories.length} categories total</p>
      </div>

      {/* Form */}
      <div className="card" style={{ maxWidth: '600px', marginBottom: '28px' }}>
        <h2 className="card-title" style={{ marginBottom: '16px' }}>{editing ? 'Edit Category' : 'Add New Category'}</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: '1 1 180px' }} placeholder="Category name"
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <select className="form-input" style={{ flex: '0 1 160px' }} value={form.icon}
            onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
            {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <input type="color" className="form-input" style={{ flex: '0 0 52px', padding: '4px 6px', height: '44px' }}
            value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
          <button className="btn btn-primary" onClick={handleSave}><PlusCircle size={16} /> {editing ? 'Update' : 'Add'}</button>
          {editing && <button className="btn btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', icon: 'Tags', color: '#6C63FF' }); }}>Cancel</button>}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {categories.map(cat => (
          <div className="card" key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.icon}</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn-icon" onClick={() => handleEdit(cat)}><Pencil size={14} /></button>
              {cat.createdBy !== 'system' && <button className="btn-icon danger" onClick={() => handleDelete(cat.id)}><Trash2 size={14} /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
