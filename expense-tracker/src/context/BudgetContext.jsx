import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { db } from '../utils/db';

const BudgetContext = createContext(null);

function budgetReducer(state, action) {
  switch (action.type) {
    case 'SEED':   return { ...state, budgets: action.payload };
    case 'SET':    return { ...state, budgets: [...state.budgets.filter(b => !(b.categoryId === action.payload.categoryId && b.monthYear === action.payload.monthYear)), action.payload] };
    case 'DELETE': return { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
    default: return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, {
    budgets: [],
  });

  useEffect(() => {
    fetch('https://expence-tracker-backend-2rub.onrender.com/api/budgets')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SEED', payload: data }))
      .catch(console.error);
  }, []);

  const setBudget = async (categoryId, monthYear, limitAmount, userId) => {
    const payload = { id: `bud_${Date.now()}`, categoryId, monthYear, limitAmount: parseFloat(limitAmount), userId, createdAt: new Date().toISOString() };
    await fetch('https://expence-tracker-backend-2rub.onrender.com/api/budgets', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    dispatch({ type: 'SET', payload });
  };

  const deleteBudget = async (id) => {
    await fetch(`https://expence-tracker-backend-2rub.onrender.com/api/budgets/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE', payload: id });
  };

  const getBudgetForCategory = (categoryId, monthYear) =>
    state.budgets.find(b => b.categoryId === categoryId && b.monthYear === monthYear);

  return (
    <BudgetContext.Provider value={{ budgets: state.budgets, setBudget, deleteBudget, getBudgetForCategory, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);
