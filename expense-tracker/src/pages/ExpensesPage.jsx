import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Download, Pencil, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useExpenses } from '../context/ExpenseContext';
import { useCategories } from '../context/CategoryContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

const statusColors = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger', draft: 'badge-default' };

export default function ExpensesPage() {
  const { paginatedExpenses, filteredExpenses, totalFiltered, filters, page, pageSize, setFilters, setPage, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const debouncedSearch = useCallback(debounce((q) => setFilters({ query: q }), 300), []);

  const handleSearch = (e) => { setSearch(e.target.value); debouncedSearch(e.target.value); };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this expense?')) return;
    deleteExpense(id);
    toast.success('Expense deleted');
  };

  const exportCSV = () => {
    if (!filteredExpenses.length) return toast.error('No data to export');
    const rows = filteredExpenses.map(e => ({
      Date: e.date, Title: e.title,
      Category: categories.find(c => c.id === e.category)?.name || 'Other',
      Amount: e.amount, PaymentMode: e.paymentMode, Status: e.status, Notes: e.notes,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, `expenses_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Exported to Excel!');
  };

  const totalPages = Math.ceil(totalFiltered / pageSize);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">{totalFiltered} records found</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}><Download size={15} /> Export</button>
          <button className="btn btn-primary" onClick={() => navigate('/expenses/add')}><PlusCircle size={16} /> Add Expense</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search expenses..." value={search} onChange={handleSearch}
              style={{ paddingLeft: '38px' }} />
          </div>
          <select className="form-input" style={{ flex: '0 1 160px' }} value={filters.category}
            onChange={e => setFilters({ category: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="form-input" style={{ flex: '0 1 150px' }} value={filters.paymentMode}
            onChange={e => setFilters({ paymentMode: e.target.value })}>
            <option value="">All Payments</option>
            {['Cash', 'UPI', 'Card', 'NetBanking'].map(p => <option key={p}>{p}</option>)}
          </select>
          <input type="date" className="form-input" style={{ flex: '0 1 150px' }} value={filters.dateFrom}
            onChange={e => setFilters({ dateFrom: e.target.value })} />
          <input type="date" className="form-input" style={{ flex: '0 1 150px' }} value={filters.dateTo}
            onChange={e => setFilters({ dateTo: e.target.value })} />
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setFilters({ query:'',category:'',paymentMode:'',dateFrom:'',dateTo:'' }); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Title</th><th>Category</th>
                <th>Payment</th><th>Status</th><th style={{ textAlign: 'right' }}>Amount</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length === 0
                ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No expenses found. Add your first one!</td></tr>
                : paginatedExpenses.map(e => {
                  const cat = categories.find(c => c.id === e.category);
                  return (
                    <tr key={e.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(e.date)}</td>
                      <td style={{ fontWeight: 500 }}>{e.title}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat?.color || '#ccc', display: 'inline-block' }} />
                          {cat?.name || 'Other'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{e.paymentMode}</td>
                      <td><span className={`badge ${statusColors[e.status] || 'badge-default'}`}>{e.status}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--danger)' }}>{formatCurrency(e.amount)}</td>
                      <td>
                        <div className="action-cell">
                          <button className="btn-icon" onClick={() => navigate(`/expenses/edit/${e.id}`)} title="Edit"><Pencil size={15} /></button>
                          <button className="btn-icon danger" onClick={() => handleDelete(e.id)} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination" style={{ padding: '16px 20px' }}>
            <span className="pagination-info">Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalFiltered)} of {totalFiltered}</span>
            <div className="pagination-btns">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return <button key={p} onClick={() => setPage(p)} className={page === p ? 'active' : ''}>{p}</button>;
              })}
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
