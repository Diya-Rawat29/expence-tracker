import { useMemo } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import * as XLSX from 'xlsx';
import { useExpenses } from '../context/ExpenseContext';
import { useCategories } from '../context/CategoryContext';
import { formatCurrency, getLast6Months, getMonthLabel } from '../utils/formatters';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export default function ReportsPage() {
  const { expenses } = useExpenses();
  const { categories } = useCategories();

  const totalAll = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const catBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).map(([id, amount]) => {
      const cat = categories.find(c => c.id === id);
      return { name: cat?.name || 'Other', amount, color: cat?.color || '#ccc', pct: ((amount / totalAll) * 100).toFixed(1) };
    }).sort((a, b) => b.amount - a.amount);
  }, [expenses, categories, totalAll]);

  const pieData = {
    labels: catBreakdown.map(c => c.name),
    datasets: [{ data: catBreakdown.map(c => c.amount), backgroundColor: catBreakdown.map(c => c.color), borderWidth: 2, borderColor: '#1E2235' }],
  };

  const months = getLast6Months();
  const lineData = {
    labels: months.map(getMonthLabel),
    datasets: [{
      label: 'Expenses', data: months.map(m => expenses.filter(e => e.date?.startsWith(m)).reduce((s, e) => s + e.amount, 0)),
      borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#6C63FF', pointRadius: 5,
    }],
  };

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#A0A3B1' } }, tooltip: { callbacks: { label: ctx => ` ₹${(ctx.parsed?.y ?? ctx.parsed).toLocaleString('en-IN')}` } } } };

  const exportReport = () => {
    if (!expenses.length) { toast.error('No data'); return; }
    const ws = XLSX.utils.json_to_sheet(expenses.map(e => ({ Date: e.date, Title: e.title, Category: categories.find(c => c.id === e.category)?.name || 'Other', Amount: e.amount, Payment: e.paymentMode })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `expense_report_${Date.now()}.xlsx`);
    toast.success('Report exported!');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Visual overview of all your expenses</p></div>
        <button className="btn btn-primary" onClick={exportReport}><Download size={16} /> Export Report</button>
      </div>

      <div className="charts-grid">
        <div className="card"><div className="card-header"><h2 className="card-title">Category Breakdown</h2></div>
          {catBreakdown.length > 0 ? <div style={{ height: '260px' }}><Pie data={pieData} options={chartOpts} /></div>
            : <div className="empty-state"><p>No data</p></div>}
        </div>
        <div className="card"><div className="card-header"><h2 className="card-title">Monthly Trend</h2></div>
          <div style={{ height: '260px' }}><Line data={lineData} options={chartOpts} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2 className="card-title">Category Summary</h2><span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total: {formatCurrency(totalAll)}</span></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Category</th><th style={{ textAlign: 'right' }}>Amount</th><th>Share</th></tr></thead>
            <tbody>
              {catBreakdown.map(c => (
                <tr key={c.name}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.color }} />
                    {c.name}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(c.amount)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-wrap" style={{ flex: 1, height: 6 }}>
                        <div className="progress-bar-fill safe" style={{ width: `${c.pct}%`, background: c.color }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{c.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
