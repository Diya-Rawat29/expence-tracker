import { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../utils/db';

const CategoryContext = createContext(null);

function categoryReducer(state, action) {
  switch (action.type) {
    case 'SEED':   return { ...state, categories: action.payload };
    case 'ADD':    return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE': return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case 'DELETE': return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    default: return state;
  }
}

export function CategoryProvider({ children }) {
  const [state, dispatch] = useReducer(categoryReducer, {
    categories: [],
  });

  useEffect(() => {
    fetch('https://expence-tracker-backend-2rub.onrender.com/api/categories')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SEED', payload: data }))
      .catch(console.error);
  }, []);

  const addCategory = async (data) => {
    const payload = { ...data, id: `cat_${Date.now()}`, createdBy: 'user', createdAt: new Date().toISOString() };
    await fetch('https://expence-tracker-backend-2rub.onrender.com/api/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    dispatch({ type: 'ADD', payload });
  };

  const updateCategory = async (id, data) => {
    await fetch(`https://expence-tracker-backend-2rub.onrender.com/api/categories/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    dispatch({ type: 'UPDATE', payload: { ...data, id } });
  };

  const deleteCategory = async (id) => {
    await fetch(`https://expence-tracker-backend-2rub.onrender.com/api/categories/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE', payload: id });
  };
  const getById = (id) => state.categories.find(c => c.id === id);

  return (
    <CategoryContext.Provider value={{ categories: state.categories, addCategory, updateCategory, deleteCategory, getById, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
