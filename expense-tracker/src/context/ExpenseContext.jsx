import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { db } from '../utils/db';

const ExpenseContext = createContext(null);

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE':
      return {
        ...state,
        expenses: state.expenses.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload.changes, updatedAt: new Date().toISOString() } : e
        ),
      };
    case 'DELETE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET_FILTERS':
      return { ...state, filters: { query:'', category:'', paymentMode:'', dateFrom:'', dateTo:'' }, page: 1 };
    default: return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: [],
    filters: { query: '', category: '', paymentMode: '', dateFrom: '', dateTo: '' },
    page: 1,
    pageSize: 10,
  });

  // Fetch initial data from backend
  useEffect(() => { 
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_EXPENSES', payload: data }))
      .catch(console.error);
  }, []);

  const filteredExpenses = useMemo(() => {
    const q = state.filters.query.toLowerCase();
    return state.expenses.filter(e => {
      if (q && !e.title?.toLowerCase().includes(q) && !e.notes?.toLowerCase().includes(q)) return false;
      if (state.filters.category && e.category !== state.filters.category) return false;
      if (state.filters.paymentMode && e.paymentMode !== state.filters.paymentMode) return false;
      if (state.filters.dateFrom && e.date < state.filters.dateFrom) return false;
      if (state.filters.dateTo && e.date > state.filters.dateTo) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [state.expenses, state.filters]);

  const paginatedExpenses = useMemo(() => {
    const start = (state.page - 1) * state.pageSize;
    return filteredExpenses.slice(start, start + state.pageSize);
  }, [filteredExpenses, state.page, state.pageSize]);

  const addExpense = async (data) => {
    const payload = { ...data, id: `exp_${Date.now()}`, amount: parseFloat(data.amount), createdAt: new Date().toISOString() };
    await fetch('/api/expenses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    dispatch({ type: 'ADD', payload });
  };

  const updateExpense = async (id, changes) => {
    const payload = { ...changes, amount: parseFloat(changes.amount || 0) };
    await fetch(`/api/expenses/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    dispatch({ type: 'UPDATE', payload: { id, changes: payload } });
  };

  const deleteExpense = async (id) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE', payload: id });
  };
  const setFilters = (f) => dispatch({ type: 'SET_FILTERS', payload: f });
  const setPage = (p) => dispatch({ type: 'SET_PAGE', payload: p });
  const getById = (id) => state.expenses.find(e => e.id === id) || null;

  return (
    <ExpenseContext.Provider value={{
      expenses: state.expenses, filteredExpenses, paginatedExpenses,
      filters: state.filters, page: state.page, pageSize: state.pageSize,
      totalFiltered: filteredExpenses.length,
      addExpense, updateExpense, deleteExpense, setFilters, setPage, getById, dispatch,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
