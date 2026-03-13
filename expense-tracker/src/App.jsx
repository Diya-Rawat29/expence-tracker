import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';

import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { CategoryProvider } from './context/CategoryContext';
import { BudgetProvider } from './context/BudgetContext';
import { NotificationProvider } from './context/NotificationContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensePage from './pages/AddExpensePage';
import IncomePage from './pages/IncomePage';
import BudgetPage from './pages/BudgetPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const router = createBrowserRouter([
  { path: '/',         element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: 'dashboard',          element: <DashboardPage /> },
      { path: 'expenses',           element: <ExpensesPage /> },
      { path: 'expenses/add',       element: <AddExpensePage /> },
      { path: 'expenses/edit/:id',  element: <AddExpensePage /> },
      { path: 'income',             element: <IncomePage /> },
      { path: 'budget',             element: <BudgetPage /> },
      { path: 'categories',         element: <CategoriesPage /> },
      { path: 'reports',            element: <ReportsPage /> },
      { path: 'notifications',      element: <NotificationsPage /> },
      { path: 'profile',            element: <ProfilePage /> },
      {
        path: 'admin',
        element: <ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

function Providers({ children }) {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ExpenseProvider>
          <BudgetProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </BudgetProvider>
        </ExpenseProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1E2235',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#2EC4B6', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#FF4757', secondary: '#fff' } },
        }}
      />
    </Providers>
  );
}
