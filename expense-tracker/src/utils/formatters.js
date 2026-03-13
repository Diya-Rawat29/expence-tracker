// src/utils/formatters.js
export function formatCurrency(amount, symbol = '₹') {
  if (isNaN(amount)) return `${symbol}0.00`;
  return `${symbol}${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

export function currentYear() {
  return new Date().getFullYear().toString();
}

export function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export function getMonthLabel(yyyyMM) {
  const [year, month] = yyyyMM.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
