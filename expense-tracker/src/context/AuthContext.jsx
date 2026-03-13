import { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../utils/db';
import { hashPassword } from '../utils/auth';

const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case 'SEED':      return { ...state, users: action.payload, seeded: true };
    case 'REGISTER':  return { ...state, users: [...state.users, action.payload] };
    case 'LOGIN':     return { ...state, currentUser: action.payload };
    case 'LOGOUT':    return { ...state, currentUser: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? { ...u, ...action.payload } : u),
        currentUser: { ...state.currentUser, ...action.payload },
      };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    users: [],
    currentUser: db.getSession(),
    seeded: db.isInitialized(),
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SEED', payload: data }))
      .catch(console.error);
  }, []);


  useEffect(() => {
    if (state.currentUser) db.setSession(state.currentUser);
    else db.clearSession();
  }, [state.currentUser]);

  const register = async ({ name, email, password, role = 'employee' }) => {
    const hashedPw = await hashPassword(password);
    const payload = {
      id: `usr_${Date.now()}`, name, email, password: hashedPw,
      role, currency: 'INR', theme: 'dark', isActive: true,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Registration failed (Email might be in use)');
      const newUser = await res.json();
      dispatch({ type: 'REGISTER', payload: newUser });
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const login = async (email, password) => {
    const hashedPw = await hashPassword(password);
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: hashedPw })
    });
    if (!res.ok) throw new Error('Invalid email or password');
    const user = await res.json();
    const { password: _, ...sessionUser } = user;
    dispatch({ type: 'LOGIN', payload: sessionUser });
    return sessionUser;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
