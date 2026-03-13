import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, TrendingUp, Receipt, Wallet, PlusCircle, ArrowRight } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';
import { useExpenses } from '../context/ExpenseContext';
import { useCategories } from '../context/CategoryContext';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency, currentMonth, getLast6Months, getMonthLabel, formatDate } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function KPICard({ title, value, sub, icon: Icon, color }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon-wrap" style={{ background: `${color}20` }}>
        <Icon size={24} color={color} />
      </div>
      <div className="kpi-info">
        <div className="kpi-label">{title}</div>
        <div className="kpi-value">{value}</div>
        {sub && <div className="kpi-trend up">{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { expenses } = useExpenses();
  const { categories } = useCategories();
  const { budgets } = useBudget();
  const navigate = useNavigate();
  const month = currentMonth();

  const thisMonthExpenses = useMemo(() =>
    expenses.filter(e => e.date?.startsWith(month)), [expenses, month]);

  const totalMonth = useMemo(() =>
    thisMonthExpenses.reduce((s, e) => s + (e.amount || 0), 0), [thisMonthExpenses]);

  const totalAll = useMemo(() =>
    expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);

  const totalBudget = useMemo(() =>
    budgets.filter(b => b.monthYear === month).reduce((s, b) => s + (b.limitAmount || 0), 0), [budgets, month]);

  const remaining = totalBudget - totalMonth;

  // Pie chart data
  const categoryData = useMemo(() => {
    const map = {};
    thisMonthExpenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    const labels = [], data = [], colors = [];
    Object.entries(map).forEach(([catId, amt]) => {
      const cat = categories.find(c => c.id === catId);
      if (cat) { labels.push(cat.name); data.push(amt); colors.push(cat.color); }
    });
    return { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#1E2235' }] };
  }, [thisMonthExpenses, categories]);

  // Bar chart data
  const barData = useMemo(() => {
    const months = getLast6Months();
    const totals = months.map(m => expenses.filter(e => e.date?.startsWith(m)).reduce((s, e) => s + e.amount, 0));
    return {
      labels: months.map(getMonthLabel),
      datasets: [{
        label: 'Expenses (₹)',
        data: totals,
        backgroundColor: 'rgba(108,99,255,0.7)',
        borderColor: '#6C63FF',
        borderWidth: 2,
        borderRadius: 8,
      }],
    };
  }, [expenses]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#A0A3B1', font: { size: 12 } } },
      tooltip: { callbacks: { label: ctx => ` ₹${ctx.parsed.toLocaleString('en-IN')}` } },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#A0A3B1' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#A0A3B1' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  const recent = useMemo(() => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [expenses]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your financial overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/expenses/add')}>
          <PlusCircle size={16} /> Add Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <KPICard title="This Month" value={formatCurrency(totalMonth)} icon={TrendingDown} color="#FF4757" sub={`${thisMonthExpenses.length} expenses`} />
        <KPICard title="Total Spent (All)" value={formatCurrency(totalAll)} icon={Receipt} color="#6C63FF" />
        <KPICard title="Monthly Budget" value={formatCurrency(totalBudget)} icon={Wallet} color="#2EC4B6" />
        <KPICard title="Budget Remaining" value={formatCurrency(remaining < 0 ? 0 : remaining)}
          icon={TrendingUp} color={remaining < 0 ? '#FF4757' : '#2EC4B6'}
          sub={remaining < 0 ? '⚠️ Over budget!' : 'Looks good!'} />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header"><h2 className="card-title">Expense by Category</h2></div>
          {categoryData.labels.length > 0
            ? <div style={{ height: '260px' }}><Pie data={categoryData} options={chartOptions} /></div>
            : <div className="empty-state"><p>No expenses this month to chart.</p></div>}
        </div>
        <div className="card">
          <div className="card-header"><h2 className="card-title">Monthly Trend (Last 6 Months)</h2></div>
          <div style={{ height: '260px' }}><Bar data={barData} options={barOptions} /></div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/expenses')}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        {recent.length === 0
          ? <div className="empty-state"><p>No expenses yet. <br /><button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/expenses/add')}>Add First Expense</button></p></div>
          : <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Payment</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
              <tbody>
                {recent.map(e => {
                  const cat = categories.find(c => c.id === e.category);
                  return (
                    <tr key={e.id}>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(e.date)}</td>
                      <td style={{ fontWeight: 500 }}>{e.title}</td>
                      <td><span className="badge badge-info">{cat?.name || 'Other'}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{e.paymentMode}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--danger)' }}>{formatCurrency(e.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>}
      </div>
    </div>
  );
}
