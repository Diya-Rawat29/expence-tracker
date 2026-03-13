import { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../utils/db';

const NotificationContext = createContext(null);

function notifReducer(state, action) {
  switch (action.type) {
    case 'SEED':      return { ...state, notifications: action.payload };
    case 'CREATE':    return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_READ': return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, isRead: true } : n) };
    case 'MARK_ALL':  return { ...state, notifications: state.notifications.map(n => ({ ...n, isRead: true })) };
    case 'DELETE':    return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    default: return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notifReducer, {
    notifications: [],
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/notifications')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SEED', payload: data }))
      .catch(console.error);
  }, []);

  const createNotification = async (userId, message, type = 'info', link = '') => {
    const payload = { id: `ntf_${Date.now()}`, userId, message, type, link, isRead: false, createdAt: new Date().toISOString() };
    await fetch('http://localhost:5000/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    dispatch({ type: 'CREATE', payload });
  };

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications: state.notifications, unreadCount,
      createNotification,
      markRead: async (id) => {
        await fetch(`http://localhost:5000/api/notifications/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
        dispatch({ type: 'MARK_READ', payload: id });
      },
      markAll: () => dispatch({ type: 'MARK_ALL' }), // Simplifying markAll for now
      deleteNotif: async (id) => {
        await fetch(`http://localhost:5000/api/notifications/${id}`, { method: 'DELETE' });
        dispatch({ type: 'DELETE', payload: id });
      },
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
