# 🏗️ Architecture Document
## Expense Management System (ExpenseTracker Pro)
### Built with React 18 + Vite 5 + JSON localStorage

**Version:** 2.0  
**Date:** 13 March 2026  
**Author:** Development Team  
**Status:** Approved

---

## 📋 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [React Component Architecture](#3-react-component-architecture)
4. [State Management Architecture (Context API)](#4-state-management-architecture-context-api)
5. [JSON Database Architecture](#5-json-database-architecture)
6. [Routing Architecture (React Router v6)](#6-routing-architecture-react-router-v6)
7. [Data Flow Architecture](#7-data-flow-architecture)
8. [Security Architecture](#8-security-architecture)
9. [File & Folder Architecture](#9-file--folder-architecture)
10. [CSS Architecture](#10-css-architecture)
11. [Build & Deployment Architecture](#11-build--deployment-architecture)
12. [Module Dependency Graph](#12-module-dependency-graph)

---

## 1. Architecture Overview

### 1.1 System Type
ExpenseTracker Pro is a **React Single-Page Application (SPA)** built with:
- **React 18** — Component-based UI with hooks
- **Vite 5** — Fast build tool with instant HMR
- **React Router DOM v6** — Client-side routing
- **React Context API + useReducer** — Global state management
- **JSON Files + localStorage** — Data persistence layer
- **CSS Modules / Global CSS Variables** — Scoped styling

### 1.2 Architecture Style

| Property | Value |
|---|---|
| Architecture Pattern | **Component-Based (React) + Context/Reducer** |
| UI Framework | **React 18 with Hooks** |
| Build Tool | **Vite 5** |
| Routing | **React Router DOM v6** |
| State Management | **Context API + useReducer** |
| Data Layer | **JSON + localStorage (via db.js utility)** |
| Rendering | **Client-Side Rendering (CSR)** |
| Deployment | **Static build (`npm run build`) → any static host** |

### 1.3 Core Principles
- **Component Reusability** — Every UI element is a React component
- **Single Source of Truth** — Each data domain has one Context provider
- **Separation of Concerns** — Pages, Components, Context, Utils, Hooks are separate
- **DRY** — Shared logic lives in custom hooks and utility files
- **Zero Backend** — No server, no PHP, no Node API — 100% client-side

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER (Web Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║              REACT APPLICATION (Vite SPA)                 ║  │
│  ║                                                           ║  │
│  ║   ┌─────────────────────────────────────────────────┐    ║  │
│  ║   │              PROVIDER TREE (App.jsx)             │    ║  │
│  ║   │  SettingsProvider                                │    ║  │
│  ║   │    AuthProvider                                  │    ║  │
│  ║   │      CategoryProvider                            │    ║  │
│  ║   │        ExpenseProvider                           │    ║  │
│  ║   │          IncomeProvider                          │    ║  │
│  ║   │            BudgetProvider                        │    ║  │
│  ║   │              ApprovalProvider                    │    ║  │
│  ║   │                NotificationProvider              │    ║  │
│  ║   │                  <RouterProvider>                │    ║  │
│  ║   │                    <Layout>                      │    ║  │
│  ║   │                      <Page Components>          │    ║  │
│  ║   └─────────────────────────────────────────────────┘    ║  │
│  ║                                                           ║  │
│  ║   ┌──────────────────────────────────────────────────┐   ║  │
│  ║   │            REACT ROUTER (Routes)                  │   ║  │
│  ║   │  /login  /register  /dashboard  /expenses         │   ║  │
│  ║   │  /income /budget /categories /reports             │   ║  │
│  ║   │  /approvals /notifications /profile /admin        │   ║  │
│  ║   └──────────────────────────────────────────────────┘   ║  │
│  ║                                                           ║  │
│  ║   ┌──────────────────────────────────────────────────┐   ║  │
│  ║   │           DATA LAYER (utils/db.js)                │   ║  │
│  ║   │    localStorage ←→ React State (via Contexts)     │   ║  │
│  ║   │    public/data/*.json  (initial seed on first run) │   ║  │
│  ║   └──────────────────────────────────────────────────┘   ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                 │
│  External (loaded once from CDN/npm):                          │
│  react-chartjs-2 | react-hot-toast | lucide-react              │
│  xlsx | jspdf | react-router-dom | date-fns                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. React Component Architecture

### 3.1 Component Hierarchy

```
<App>
  └── <Providers> (all Context providers nested)
        └── <RouterProvider>
              ├── <Layout>          (Sidebar + Navbar wrapper)
              │     ├── <Sidebar>
              │     ├── <Navbar>
              │     └── <Outlet>   (page content)
              │           ├── <DashboardPage>
              │           │     ├── <KPICard> × 4
              │           │     ├── <PieChart>
              │           │     ├── <BarChart>
              │           │     └── <RecentTransactions>
              │           │
              │           ├── <ExpensesPage>
              │           │     ├── <SearchBar>
              │           │     ├── <FilterPanel>
              │           │     ├── <DataTable>
              │           │     └── <Pagination>
              │           │
              │           ├── <AddExpensePage>
              │           │     └── <ExpenseForm>
              │           │
              │           ├── <BudgetPage>
              │           │     ├── <BudgetCard> × N
              │           │     └── <ProgressBar>
              │           │
              │           ├── <ReportsPage>
              │           │     ├── <LineChart>
              │           │     ├── <PieChart>
              │           │     └── <CategoryBreakdownTable>
              │           │
              │           └── ... (other pages)
              │
              ├── <LoginPage>        (public route)
              └── <RegisterPage>     (public route)
```

### 3.2 Component Categories

| Category | Files | Description |
|---|---|---|
| **Pages** | `src/pages/*.jsx` | Full route-level components, one per route |
| **Layout** | `src/components/layout/` | Sidebar, Navbar, Layout wrapper |
| **Common** | `src/components/common/` | KPICard, DataTable, Modal, Badge, etc. |
| **Charts** | `src/components/charts/` | PieChart, BarChart, LineChart wrappers |
| **Guards** | `ProtectedRoute.jsx` | Auth + role check before rendering |

---

## 4. State Management Architecture (Context API)

### 4.1 Context Provider Structure

Each data domain gets its own Context + Reducer pattern:

```jsx
// Pattern used in every Context file:
const SomeContext = createContext(null);

function someReducer(state, action) {
  switch (action.type) {
    case 'ADD':    return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE': return { ...state, items: state.items.map(...) };
    case 'DELETE': return { ...state, items: state.items.filter(...) };
    default:       return state;
  }
}

export function SomeProvider({ children }) {
  const [state, dispatch] = useReducer(someReducer, loadFromLocalStorage());
  
  // Sync to localStorage on every state change
  useEffect(() => {
    db.set('ems_table', state.items);
  }, [state.items]);
  
  return (
    <SomeContext.Provider value={{ state, dispatch }}>
      {children}
    </SomeContext.Provider>
  );
}

export const useSome = () => useContext(SomeContext);
```

### 4.2 Context Files & Responsibilities

| Context File | State Managed | Key Actions |
|---|---|---|
| `AuthContext.jsx` | `currentUser`, `users[]` | LOGIN, LOGOUT, REGISTER, UPDATE_PROFILE |
| `ExpenseContext.jsx` | `expenses[]`, `filters`, `pagination` | ADD, UPDATE, DELETE, SET_FILTERS, SET_PAGE |
| `IncomeContext.jsx` | `income[]` | ADD, UPDATE, DELETE |
| `BudgetContext.jsx` | `budgets[]` | SET_BUDGET, UPDATE_BUDGET, DELETE_BUDGET |
| `CategoryContext.jsx` | `categories[]` | ADD, UPDATE, DELETE, SEED |
| `ApprovalContext.jsx` | `approvals[]` | SUBMIT, APPROVE, REJECT |
| `NotificationContext.jsx` | `notifications[]` | CREATE, MARK_READ, DELETE, MARK_ALL_READ |
| `SettingsContext.jsx` | `settings{}` | UPDATE_SETTINGS, RESET |

### 4.3 Custom Hooks (Convenience Layer)

```jsx
// hooks/useExpenses.js
// Wraps useContext(ExpenseContext) with helper methods
export function useExpenses() {
  const { state, dispatch } = useContext(ExpenseContext);
  
  const addExpense = (data) => dispatch({ type: 'ADD', payload: { ...data, id: generateId() } });
  const updateExpense = (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } });
  const deleteExpense = (id) => dispatch({ type: 'DELETE', payload: id });
  
  const filteredExpenses = useMemo(() => {
    return state.expenses.filter(e => {
      // apply state.filters
    });
  }, [state.expenses, state.filters]);
  
  return { expenses: filteredExpenses, addExpense, updateExpense, deleteExpense };
}
```

---

## 5. JSON Database Architecture

### 5.1 Data Flow (React + localStorage)

```
App First Load (ems_initialized not set)
         │
         ▼
fetch('/data/users.json')
fetch('/data/categories.json')
... (all 8 JSON files)
         │
         ▼
Store in localStorage:
  ems_users, ems_expenses, ems_income ...
  ems_initialized = "true"
         │
         ▼
Each Context initializes:
  const init = db.getAll('users') // read from localStorage
  useReducer(reducer, { users: init })
         │
         ▼
React State holds runtime data
         │
    ┌────┴────┐
  Read      Write
    │         │
    │    dispatch action
    │         │
    │    reducer updates state
    │         │
    │    useEffect syncs to localStorage
    └────┬────┘
         │
  Components re-render
```

### 5.2 `utils/db.js` — localStorage Engine

```javascript
export const db = {
  // Read
  getAll: (key) => JSON.parse(localStorage.getItem(key)) || [],
  getOne: (key, id) => db.getAll(key).find(r => r.id === id) || null,
  getSettings: () => JSON.parse(localStorage.getItem('ems_settings')) || {},

  // Write
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  setSettings: (data) => localStorage.setItem('ems_settings', JSON.stringify(data)),

  // Session
  setSession: (user) => localStorage.setItem('ems_currentUser', JSON.stringify(user)),
  getSession: () => JSON.parse(localStorage.getItem('ems_currentUser')),
  clearSession: () => localStorage.removeItem('ems_currentUser'),

  // Helpers
  isInitialized: () => !!localStorage.getItem('ems_initialized'),
  markInitialized: () => localStorage.setItem('ems_initialized', 'true'),
  
  // Export
  exportTable: (key, name) => {
    const data = db.getAll(key);
    const blob = new Blob([JSON.stringify({ [name]: data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${name}.json`; a.click();
  },
  
  // Reset
  clearAll: () => {
    ['ems_users','ems_expenses','ems_income','ems_categories',
     'ems_budgets','ems_approvals','ems_notifications','ems_settings',
     'ems_currentUser','ems_initialized'].forEach(k => localStorage.removeItem(k));
  }
};
```

### 5.3 localStorage Key Map

| localStorage Key | Context | Description |
|---|---|---|
| `ems_users` | AuthContext | All registered users |
| `ems_expenses` | ExpenseContext | All expense records |
| `ems_income` | IncomeContext | All income records |
| `ems_categories` | CategoryContext | Expense categories |
| `ems_budgets` | BudgetContext | Budget limits |
| `ems_approvals` | ApprovalContext | Approval records |
| `ems_notifications` | NotificationContext | Notifications |
| `ems_settings` | SettingsContext | App settings |
| `ems_currentUser` | AuthContext | Logged-in session |
| `ems_initialized` | `db.js` | Seed flag |

---

## 6. Routing Architecture (React Router v6)

### 6.1 Route Configuration (`App.jsx`)

```jsx
const router = createBrowserRouter([
  // Public Routes
  { path: '/',         element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Protected Routes (wrapped in <ProtectedRoute>)
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: 'dashboard',        element: <DashboardPage /> },
      { path: 'expenses',         element: <ExpensesPage /> },
      { path: 'expenses/add',     element: <AddExpensePage /> },
      { path: 'expenses/edit/:id',element: <AddExpensePage /> },
      { path: 'income',           element: <IncomePage /> },
      { path: 'budget',           element: <BudgetPage /> },
      { path: 'categories',       element: <CategoriesPage /> },
      { path: 'reports',          element: <ReportsPage /> },
      {
        path: 'approvals',
        element: <ProtectedRoute requiredRole="manager"><ApprovalsPage /></ProtectedRoute>
      },
      { path: 'notifications',    element: <NotificationsPage /> },
      { path: 'profile',          element: <ProfilePage /> },
      {
        path: 'admin',
        element: <ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>
      },
    ]
  },
  { path: '*', element: <Navigate to="/" /> }
]);
```

### 6.2 `ProtectedRoute` Component

```jsx
// components/common/ProtectedRoute.jsx
export function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  const roleRank = { admin: 3, manager: 2, employee: 1 };
  if (requiredRole && (roleRank[currentUser.role] < roleRank[requiredRole])) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}
```

---

## 7. Data Flow Architecture

### 7.1 Add Expense Flow (React)

```
User fills <ExpenseForm> in AddExpensePage
        │
        ▼
onSubmit → validate(formData) [validators.js]
        │
  [invalid] → setErrors(errors) → show inline errors
        │
  [valid]
        │
        ▼
const { addExpense } = useExpenses()
addExpense(formData)
        │
        ▼
dispatch({ type: 'ADD', payload: { ...formData, id: generateId(), createdAt: now } })
        │
        ▼
expenseReducer → returns new state with expense appended
        │
        ▼
useEffect in ExpenseContext:
→ db.set('ems_expenses', newState.expenses)   // persist to localStorage
        │
        ▼
If status === 'Pending':
→ notificationDispatch({ type: 'CREATE', payload: { message: '...', userId: managerId } })
        │
        ▼
toast.success('Expense added! ✅')  // react-hot-toast
navigate('/expenses')               // React Router
        │
        ▼
ExpensesPage re-renders with new expense in list (reactive)
```

### 7.2 Dashboard Data Flow (React)

```
<DashboardPage> mounts
        │
        ▼
const { expenses } = useExpenses()
const { income }   = useIncome()
const { budgets }  = useBudget()
const { categories } = useCategories()
        │
        ▼
useMemo computations:
  totalThisMonth = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0)
        │
        ▼
  categoryBreakdown = groupBy(expenses, 'category')
                      → map to { name, amount, color }
        │
        ▼
  monthlyTrend = getLast6Months()
                 → each month: sum expenses
        │
        ▼
Render:
  <KPICard value={totalThisMonth} />
  <PieChart data={categoryBreakdown} />
  <BarChart data={monthlyTrend} />
  <RecentTransactions data={expenses.slice(0, 10)} />
```

---

## 8. Security Architecture

### 8.1 Password Hashing (SubtleCrypto — SHA-256)

```javascript
// utils/auth.js
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 8.2 Route Protection

| Layer | Tool | How |
|---|---|---|
| Route-level | `<ProtectedRoute>` | Checks `currentUser` from AuthContext |
| Role-level | `requiredRole` prop | Compares role ranks |
| Data-level | Context filter | Employees only see `userId === currentUser.id` |

### 8.3 XSS Prevention in React
React automatically escapes all JSX expressions by default:
```jsx
// ✅ Safe — React escapes this automatically
<span>{expense.title}</span>

// ⚠️ Dangerous — avoid dangerouslySetInnerHTML unless necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // NEVER use with user data
```

---

## 9. File & Folder Architecture

```
expense-management-system/
│
├── public/                        ← Static files served by Vite
│   ├── data/                      ← 🗄️ JSON Seed Files
│   │   ├── users.json
│   │   ├── expenses.json
│   │   ├── income.json
│   │   ├── categories.json
│   │   ├── budgets.json
│   │   ├── approvals.json
│   │   ├── notifications.json
│   │   └── settings.json
│   └── images/
│       ├── logo.png
│       └── avatar-default.png
│
├── src/                           ← React source code
│   │
│   ├── main.jsx                   ← Vite + React entry (ReactDOM.render)
│   ├── App.jsx                    ← Router config + Provider tree
│   │
│   ├── context/                   ← Global State (Context + Reducer)
│   │   ├── AuthContext.jsx
│   │   ├── ExpenseContext.jsx
│   │   ├── IncomeContext.jsx
│   │   ├── BudgetContext.jsx
│   │   ├── CategoryContext.jsx
│   │   ├── ApprovalContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── SettingsContext.jsx
│   │
│   ├── pages/                     ← Route-level Page Components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ExpensesPage.jsx
│   │   ├── AddExpensePage.jsx
│   │   ├── IncomePage.jsx
│   │   ├── BudgetPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── ApprovalsPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── AdminPage.jsx
│   │
│   ├── components/                ← Reusable UI Components
│   │   ├── layout/
│   │   │   ├── Layout.jsx         ← Sidebar + Navbar wrapper with <Outlet>
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── ProtectedRoute.jsx ← Auth + Role guard
│   │   │   ├── KPICard.jsx        ← Dashboard stat cards
│   │   │   ├── DataTable.jsx      ← Generic sortable/paginated table
│   │   │   ├── Modal.jsx          ← Reusable modal dialog
│   │   │   ├── Badge.jsx          ← Status pills
│   │   │   ├── ProgressBar.jsx    ← Budget usage bar
│   │   │   ├── SearchBar.jsx      ← Search input with debounce
│   │   │   ├── FilterPanel.jsx    ← Filter dropdowns + date range
│   │   │   └── Pagination.jsx     ← Page number navigation
│   │   │
│   │   └── charts/
│   │       ├── PieChart.jsx       ← react-chartjs-2 Pie wrapper
│   │       ├── BarChart.jsx       ← react-chartjs-2 Bar wrapper
│   │       └── LineChart.jsx      ← react-chartjs-2 Line wrapper
│   │
│   ├── hooks/                     ← Custom React Hooks
│   │   ├── useAuth.js             ← useContext(AuthContext) + helpers
│   │   ├── useExpenses.js         ← useContext(ExpenseContext) + computed
│   │   ├── useBudget.js           ← useContext(BudgetContext) + computed
│   │   └── useLocalStorage.js     ← Generic localStorage hook
│   │
│   ├── utils/                     ← Pure utility functions (no React)
│   │   ├── db.js                  ← localStorage engine
│   │   ├── auth.js                ← SHA-256 password hashing
│   │   ├── formatters.js          ← formatCurrency, formatDate, etc.
│   │   └── validators.js          ← Form validation functions
│   │
│   └── styles/                    ← Global CSS
│       ├── index.css              ← CSS Variables + reset + typography
│       ├── App.css                ← App layout
│       └── components.css         ← Shared component styles
│
├── index.html                     ← Vite HTML entry template
├── vite.config.js                 ← Vite config (plugins, alias)
├── package.json                   ← All dependencies
├── .eslintrc.cjs                  ← ESLint config
└── docs/
    ├── Architecture.md
    ├── PRD.md
    ├── MVP TECH DOC.md
    ├── System Designe.md
    └── info.txt
```

---

## 10. CSS Architecture

### 10.1 Strategy
- **Global variables** in `src/styles/index.css` (tokens for colors, spacing, etc.)
- **Component-specific** styles co-located or in `components.css`
- No Tailwind (unless requested) — pure CSS variables for design system

### 10.2 Design Tokens (CSS Variables)

```css
/* src/styles/index.css */
:root {
  --primary:        #6C63FF;
  --primary-dark:   #5A52D5;
  --secondary:      #FF6584;
  --success:        #2EC4B6;
  --warning:        #FFCC00;
  --danger:         #FF4757;

  /* Dark Theme (default) */
  --bg-primary:     #0F1117;
  --bg-secondary:   #1A1D2E;
  --bg-card:        #242736;
  --text-primary:   #FFFFFF;
  --text-secondary: #A0A3B1;
  --border:         #2E3146;

  --font-family:    'Poppins', sans-serif;
  --radius-md:      12px;
  --shadow-md:      0 4px 24px rgba(0,0,0,0.35);
}

[data-theme="light"] {
  --bg-primary:   #F4F6FA;
  --bg-secondary: #FFFFFF;
  --bg-card:      #FFFFFF;
  --text-primary: #1A1D2E;
  --border:       #E2E8F0;
}
```

---

## 11. Build & Deployment Architecture

### 11.1 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['date-fns', 'xlsx', 'jspdf']
        }
      }
    }
  }
});
```

### 11.2 Build Outputs

| Command | Output | Use |
|---|---|---|
| `npm run dev` | localhost:5173 | Development with HMR |
| `npm run build` | `dist/` folder | Production build |
| `npm run preview` | localhost:4173 | Preview production build |

### 11.3 Deployment Options

| Platform | Steps | Cost |
|---|---|---|
| **Vercel** | `vercel deploy` or connect GitHub | Free |
| **Netlify** | Drag & drop `dist/` folder | Free |
| **GitHub Pages** | `npm run build` → push `dist/` to `gh-pages` branch | Free |
| **Local** | `npm run dev` | Local only |

---

## 12. Module Dependency Graph

```
App.jsx
  ├── React Router DOM (createBrowserRouter)
  ├── All Providers (AuthProvider → ... → NotificationProvider)
  │
  ├── pages/LoginPage.jsx
  │     └── hooks/useAuth.js → context/AuthContext.jsx → utils/db.js
  │
  ├── pages/DashboardPage.jsx
  │     ├── hooks/useExpenses.js → context/ExpenseContext.jsx → utils/db.js
  │     ├── hooks/useBudget.js   → context/BudgetContext.jsx → utils/db.js
  │     ├── components/charts/PieChart.jsx → react-chartjs-2
  │     ├── components/charts/BarChart.jsx → react-chartjs-2
  │     └── components/common/KPICard.jsx
  │
  ├── pages/AddExpensePage.jsx
  │     ├── hooks/useExpenses.js
  │     ├── useCategories (CategoryContext)
  │     └── utils/validators.js
  │
  ├── pages/ExpensesPage.jsx
  │     ├── hooks/useExpenses.js
  │     ├── components/common/DataTable.jsx
  │     ├── components/common/SearchBar.jsx
  │     ├── components/common/FilterPanel.jsx
  │     └── components/common/Pagination.jsx
  │
  └── components/layout/Layout.jsx
        ├── components/layout/Sidebar.jsx
        └── components/layout/Navbar.jsx
              └── context/NotificationContext.jsx
```

---

*Document End — Architecture.md v2.0 (React + Vite)*
