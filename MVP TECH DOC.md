# 📦 MVP Technical Document
## Expense Management System — Minimum Viable Product
### Built with React 18 + Vite 5 + JSON localStorage

**Version:** 2.0  
**Date:** 13 March 2026  
**Document Type:** MVP Technical Specification  
**Status:** Ready for Development

---

## 📋 Table of Contents

1. [What is MVP?](#1-what-is-mvp)
2. [MVP Scope Definition](#2-mvp-scope-definition)
3. [In-Scope Features (MVP)](#3-in-scope-features-mvp)
4. [Out-of-Scope (Post-MVP)](#4-out-of-scope-post-mvp)
5. [Tech Stack for MVP](#5-tech-stack-for-mvp)
6. [MVP File & Component List](#6-mvp-file--component-list)
7. [MVP JSON Seed Data](#7-mvp-json-seed-data)
8. [MVP React Pages & UI](#8-mvp-react-pages--ui)
9. [MVP User Stories](#9-mvp-user-stories)
10. [MVP Development Milestones](#10-mvp-development-milestones)
11. [Setup & Run Instructions](#11-setup--run-instructions)
12. [MVP Definition of Done](#12-mvp-definition-of-done)
13. [Known Limitations in MVP](#13-known-limitations-in-mvp)

---

## 1. What is MVP?

The **MVP (Minimum Viable Product)** is the smallest functional version of the Expense Management System that:

- Delivers **core value** to the user
- Can be **built quickly** (target: 2 weeks)
- Allows for **real user testing and feedback**
- Avoids **over-engineering** features that may not be needed

> **Goal:** A working React + Vite app where a user can log in, add expenses, view them in a beautiful dashboard with charts, manage budgets — all stored in JSON/localStorage. No backend needed.

---

## 2. MVP Scope Definition

### ✅ MVP Must Have
| # | Feature | Priority |
|---|---|---|
| 1 | Vite project setup + React Router v6 | 🔴 Critical |
| 2 | AuthContext (Login, Register, Logout, Session) | 🔴 Critical |
| 3 | ExpenseContext (CRUD, Filter, Search) | 🔴 Critical |
| 4 | CategoryContext (Default categories seeded) | 🔴 Critical |
| 5 | BudgetContext (Set limit + overspend alert) | 🔴 Critical |
| 6 | db.js (localStorage JSON engine) | 🔴 Critical |
| 7 | DashboardPage with KPI cards + 2 charts | 🔴 Critical |
| 8 | ExpensesPage (list, search, filter, paginate) | 🔴 Critical |
| 9 | AddExpensePage (add + edit form) | 🔴 Critical |
| 10 | ProtectedRoute component | 🔴 Critical |
| 11 | Layout (Sidebar + Navbar) | 🔴 Critical |
| 12 | react-hot-toast notifications | 🟡 Important |
| 13 | Export to CSV (xlsx) | 🟡 Important |

### 🟡 MVP Should Have (if time allows)
| # | Feature |
|---|---|
| 14 | IncomeContext + IncomePage |
| 15 | BudgetPage with progress bars |
| 16 | CategoriesPage (CRUD) |
| 17 | Dark/Light theme toggle |
| 18 | ProfilePage (edit name, theme, currency) |

### 🔵 MVP Won't Have (Post-MVP)
| # | Feature | Reason |
|---|---|---|
| 19 | Manager Approval Workflow | Complexity |
| 20 | PDF Export (jsPDF) | Time |
| 21 | Recurring Expenses | Complex scheduling |
| 22 | Receipt Upload (base64) | Large localStorage usage |
| 23 | Admin Panel | Not needed for MVP testing |
| 24 | Audit Logs | Nice-to-have |
| 25 | Multi-device sync | Needs backend |

---

## 3. In-Scope Features (MVP)

### 3.1 🔐 Authentication (AuthContext.jsx)

| Feature | Implementation |
|---|---|
| Register | `dispatch({ type: 'REGISTER', payload: user })` → `db.set('ems_users', users)` |
| Login | Hash password → match in users array → `db.setSession(user)` |
| Logout | `db.clearSession()` → `navigate('/')` |
| Route Guard | `<ProtectedRoute>` checks `db.getSession()` on mount |
| Roles | Admin and Employee only in MVP |

**Components:** `LoginPage.jsx`, `RegisterPage.jsx`  
**Context:** `AuthContext.jsx`  
**Hook:** `useAuth.js`

---

### 3.2 💸 Expense Management (ExpenseContext.jsx)

| Feature | Implementation |
|---|---|
| Add Expense | `dispatch({ type: 'ADD', payload })` |
| Edit Expense | `dispatch({ type: 'UPDATE', payload: { id, changes } })` |
| Delete Expense | `dispatch({ type: 'DELETE', payload: id })` with confirm |
| List Expenses | Filtered/paginated from `state.expenses` via `useMemo` |
| Search | `state.filters.query` checked against `title` & `notes` |
| Filter | By `category`, `paymentMode`, `dateFrom`, `dateTo` |
| Pagination | `useMemo` on `state.page` × `state.pageSize` |

**Expense object fields (MVP):**
```json
{
  "id": "exp_1710000000001",
  "title": "Office Supplies",
  "amount": 450.00,
  "date": "2026-03-13",
  "category": "cat_office",
  "paymentMode": "UPI",
  "notes": "",
  "userId": "usr_001",
  "status": "approved",
  "createdAt": "2026-03-13T08:00:00Z"
}
```

**Pages:** `ExpensesPage.jsx`, `AddExpensePage.jsx`  
**Context:** `ExpenseContext.jsx`  
**Hook:** `useExpenses.js`

---

### 3.3 📊 Dashboard (DashboardPage.jsx)

| Widget | Data Source | React Implementation |
|---|---|---|
| Total This Month | `expenses.filter(e => isCurrentMonth(e.date)).sum('amount')` | `useMemo` |
| Total This Year | `expenses.filter(e => isCurrentYear(e.date)).sum('amount')` | `useMemo` |
| Number of Expenses | `expenses.length` | Direct |
| Remaining Budget | `totalBudget - totalSpentThisMonth` | `useMemo` |
| Pie Chart | `groupBy(expenses, 'category')` | `<PieChart>` component |
| Bar Chart | `last6MonthsTotals(expenses)` | `<BarChart>` component |
| Recent Transactions | `expenses.sort(byDate).slice(0, 5)` | `useMemo` |

**Libraries:** `react-chartjs-2` + `chart.js`

---

### 3.4 💰 Budget Management (BudgetContext.jsx)

| Feature | Implementation |
|---|---|
| Set Budget | `dispatch({ type: 'SET_BUDGET', payload: { categoryId, monthYear, limit } })` |
| Progress Bar | `(spent / limit) * 100` → CSS width |
| Warning | `spent >= limit * 0.9` → yellow class |
| Danger | `spent >= limit` → red class + toast warning |

**Page:** `BudgetPage.jsx`

---

### 3.5 🏷️ Categories (CategoryContext.jsx)

| Feature | Implementation |
|---|---|
| Default seed | Fetched from `public/data/categories.json` on first run |
| Display in forms | `useCategories()` → dropdown options |
| CRUD | `dispatch` actions → localStorage sync |

**Page:** `CategoriesPage.jsx`

---

### 3.6 📤 Export CSV (in ReportsPage or ExpensesPage)

```jsx
import * as XLSX from 'xlsx';

function exportToCSV(expenses) {
  const ws = XLSX.utils.json_to_sheet(expenses);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
  XLSX.writeFile(wb, `expenses_${new Date().toISOString().slice(0,10)}.xlsx`);
}
```

---

## 4. Out-of-Scope (Post-MVP)

| Feature | Target Version |
|---|---|
| Manager Approval Workflow | v1.2 |
| PDF Export (jsPDF) | v1.1 |
| Receipt Upload (base64) | v1.2 |
| Recurring Expenses | v1.2 |
| Admin Panel (full) | v1.2 |
| Multi-currency live rates | v2.0 |
| PWA / Offline Service Worker | v2.0 |
| Backend + cloud storage | v2.0 |

---

## 5. Tech Stack for MVP

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | ^18.3.0 | Component-based UI |
| Build Tool | Vite | ^5.2.0 | Fast dev server + HMR |
| Routing | React Router DOM | ^6.22.0 | SPA navigation |
| State | React Context + useReducer | Built-in | Global state management |
| Charts | react-chartjs-2 + chart.js | ^5.2.0 + ^4.4.0 | Dashboard charts |
| Notifications | react-hot-toast | ^2.4.1 | Toast alerts |
| Export | xlsx (SheetJS) | ^0.18.5 | CSV/Excel export |
| Icons | lucide-react | ^0.358.0 | Icon components |
| Dates | date-fns | ^3.3.1 | Date formatting |
| Styling | CSS Variables + CSS Modules | — | Scoped styling |
| Storage | localStorage + JSON | — | Data persistence |

---

## 6. MVP File & Component List

### Core Files Required for MVP

```
src/
├── main.jsx                    ← Entry point
├── App.jsx                     ← Router + Providers
│
├── context/
│   ├── AuthContext.jsx         ← Login/Register/Logout
│   ├── ExpenseContext.jsx      ← Expense CRUD + state
│   ├── CategoryContext.jsx     ← Category + seeding
│   └── BudgetContext.jsx       ← Budget limits + alerts
│
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx       ← KPI cards + charts
│   ├── ExpensesPage.jsx        ← List + search + filter
│   ├── AddExpensePage.jsx      ← Add/edit form
│   ├── BudgetPage.jsx
│   └── CategoriesPage.jsx
│
├── components/
│   ├── layout/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   ├── common/
│   │   ├── ProtectedRoute.jsx
│   │   ├── KPICard.jsx
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── ProgressBar.jsx
│   │   └── SearchBar.jsx
│   └── charts/
│       ├── PieChart.jsx
│       └── BarChart.jsx
│
├── hooks/
│   ├── useAuth.js
│   └── useExpenses.js
│
├── utils/
│   ├── db.js                   ← localStorage engine
│   ├── auth.js                 ← SHA-256 hash
│   ├── formatters.js           ← formatCurrency, formatDate
│   └── validators.js           ← validateExpense, validateUser
│
└── styles/
    ├── index.css               ← CSS Variables + reset
    └── App.css                 ← Layout styles

public/data/
├── users.json                  ← Seed users
├── expenses.json               ← Empty []
├── categories.json             ← 10 default categories
├── budgets.json                ← Empty []
└── settings.json               ← Default settings
```

**Total MVP files: ~35 files**

---

## 7. MVP JSON Seed Data

### 7.1 `public/data/users.json`

```json
{
  "users": [
    {
      "id": "usr_001",
      "name": "Admin User",
      "email": "admin@demo.com",
      "password": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      "role": "admin",
      "currency": "INR",
      "theme": "dark",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    {
      "id": "usr_002",
      "name": "Jane Employee",
      "email": "jane@demo.com",
      "password": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      "role": "employee",
      "currency": "INR",
      "theme": "dark",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

> **Demo credentials:** Email: `admin@demo.com` | Password: `admin`  
> (SHA-256 of "admin": `8c6976e5...`)

---

### 7.2 `public/data/categories.json`

```json
{
  "categories": [
    { "id": "cat_food",   "name": "Food & Dining",     "icon": "UtensilsCrossed", "color": "#FF6384" },
    { "id": "cat_travel", "name": "Travel & Transport", "icon": "Car",             "color": "#36A2EB" },
    { "id": "cat_health", "name": "Healthcare",         "icon": "HeartPulse",      "color": "#FF9F40" },
    { "id": "cat_rent",   "name": "Rent & Utilities",   "icon": "Home",            "color": "#4BC0C0" },
    { "id": "cat_edu",    "name": "Education",           "icon": "GraduationCap",  "color": "#9966FF" },
    { "id": "cat_shop",   "name": "Shopping",            "icon": "ShoppingBag",    "color": "#FF6384" },
    { "id": "cat_entmt",  "name": "Entertainment",       "icon": "Film",           "color": "#FFCD56" },
    { "id": "cat_office", "name": "Office / Business",   "icon": "Briefcase",      "color": "#4BC0C0" },
    { "id": "cat_tech",   "name": "Technology",          "icon": "Smartphone",     "color": "#36A2EB" },
    { "id": "cat_other",  "name": "Other",               "icon": "MoreHorizontal", "color": "#C9CBCF" }
  ]
}
```

> **Note:** `icon` values are `lucide-react` icon component names.

---

### 7.3 `public/data/settings.json`

```json
{
  "appName": "ExpenseTracker Pro",
  "version": "1.0.0",
  "currency": "INR",
  "currencySymbol": "₹",
  "dateFormat": "DD/MM/YYYY",
  "theme": "dark",
  "language": "en",
  "taxRate": 18,
  "fiscalYearStart": "April"
}
```

---

### 7.4 Empty Initial Files

```json
// expenses.json, income.json, budgets.json, approvals.json, notifications.json
{ "data": [] }
```

---

## 8. MVP React Pages & UI

### 8.1 LoginPage (`/`)

```jsx
// Key elements:
<form onSubmit={handleLogin}>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button type="submit">Login</button>
  <Link to="/register">Don't have an account? Register</Link>
</form>
// On success: navigate('/dashboard')
// On fail: toast.error('Invalid credentials')
```

### 8.2 DashboardPage (`/dashboard`)

```jsx
// Uses hooks:
const { expenses } = useExpenses();
const { budgets } = useBudget();
const { categories } = useCategories();

// KPI Cards:
<KPICard title="This Month"   value={totalThisMonth}  icon={<TrendingDown />} />
<KPICard title="This Year"    value={totalThisYear}   icon={<Calendar />} />
<KPICard title="Expense Count" value={expenseCount}   icon={<Receipt />} />
<KPICard title="Budget Left"  value={remainingBudget} icon={<Wallet />} />

// Charts:
<PieChart data={categoryData} />
<BarChart data={monthlyData} />

// Recent Transactions:
<DataTable data={recentExpenses} columns={columns} />
```

### 8.3 ExpensesPage (`/expenses`)

```jsx
const { expenses, setFilters } = useExpenses();

return (
  <>
    <SearchBar onChange={(q) => setFilters({ query: q })} />
    <FilterPanel categories={categories} onFilter={setFilters} />
    <button onClick={() => navigate('/expenses/add')}>+ Add Expense</button>
    <button onClick={() => exportToCSV(expenses)}>Export CSV</button>
    <DataTable
      data={paginatedExpenses}
      onEdit={(id) => navigate(`/expenses/edit/${id}`)}
      onDelete={(id) => dispatch({ type: 'DELETE', payload: id })}
    />
    <Pagination total={total} page={page} onChange={setPage} />
  </>
);
```

### 8.4 AddExpensePage (`/expenses/add` and `/expenses/edit/:id`)

```jsx
// Controlled form with React state:
const [form, setForm] = useState({
  title: '', amount: '', date: today, 
  category: '', paymentMode: 'Cash', notes: ''
});

// Edit mode: pre-fill from useExpenses().getById(id) via useParams
const { id } = useParams();
const isEdit = !!id;
```

---

## 9. MVP User Stories

### 🧑 As a User (Employee / Admin)

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-01 | Register an account | Form validates → saved to ems_users → redirect to login |
| US-02 | Log in | Credentials match → session set → redirect to `/dashboard` |
| US-03 | Add an expense | All required fields → saved → success toast → redirect |
| US-04 | Edit an expense | Pre-filled form → changes saved → toast confirmation |
| US-05 | Delete an expense | Confirm dialog → removed from list → success toast |
| US-06 | See total expenses this month | Dashboard KPI card shows correct ₹ sum |
| US-07 | Filter expenses by category | Dropdown changes → list filters reactively |
| US-08 | Search for an expense | Types in search → list filters with debounce |
| US-09 | Set a budget for a category | Budget saved → progress bar visible |
| US-10 | Get budget overspend warning | Progress bar turns red + toast.warning fires |
| US-11 | Export expenses to CSV | File downloaded with correct column headers |
| US-12 | Log out | Session cleared → redirected to `/` login page |
| US-13 | See expense breakdown chart | Pie chart shows correct category proportions |

---

## 10. MVP Development Milestones

### 📅 Phase 1 — Project Setup (Day 1–2)

- [ ] `npm create vite@latest expense-tracker -- --template react`
- [ ] Install all dependencies (react-router-dom, chart.js etc.)
- [ ] Configure `vite.config.js` with `@` alias
- [ ] Create `public/data/` with all 5 seed JSON files
- [ ] Create folder structure (`pages/`, `context/`, `components/`, etc.)
- [ ] Setup global CSS variables in `src/styles/index.css`
- [ ] Build `utils/db.js` (localStorage engine)
- [ ] Build `utils/auth.js` (SHA-256 hash)
- [ ] Build `utils/formatters.js` + `validators.js`

### 📅 Phase 2 — Auth + Layout (Day 3–5)

- [ ] Build `AuthContext.jsx` (register, login, logout, seed from JSON)
- [ ] Build `useAuth.js` hook
- [ ] Build `LoginPage.jsx` (form + toast on error)
- [ ] Build `RegisterPage.jsx`
- [ ] Build `Layout.jsx` + `Sidebar.jsx` + `Navbar.jsx`
- [ ] Build `ProtectedRoute.jsx`
- [ ] Configure React Router in `App.jsx`

### 📅 Phase 3 — Core Expense Features (Day 6–9)

- [ ] Build `CategoryContext.jsx` (seed + CRUD)
- [ ] Build `ExpenseContext.jsx` (CRUD + filters + pagination)
- [ ] Build `useExpenses.js` hook
- [ ] Build `AddExpensePage.jsx` (add + edit mode)
- [ ] Build `ExpensesPage.jsx` (list + search + filter + export)
- [ ] Build common components: `DataTable`, `SearchBar`, `Badge`, `Modal`

### 📅 Phase 4 — Dashboard + Charts (Day 10–12)

- [ ] Build `BudgetContext.jsx`
- [ ] Build `KPICard.jsx` component
- [ ] Build `PieChart.jsx` + `BarChart.jsx` (react-chartjs-2 wrappers)
- [ ] Build `DashboardPage.jsx` connecting all data
- [ ] Build `BudgetPage.jsx` with `ProgressBar.jsx`
- [ ] Build `CategoriesPage.jsx`

### 📅 Phase 5 — Polish + Testing (Day 13–14)

- [ ] Add react-hot-toast globally in `App.jsx`
- [ ] Add Dark/Light theme toggle to Navbar
- [ ] Test all CRUD + React state sync
- [ ] Test localStorage persistence across refresh
- [ ] Test route guards (employee can't access admin)
- [ ] Fix UI/UX issues, responsive check
- [ ] Write README.md

---

## 11. Setup & Run Instructions

### Quick Start

```bash
# 1. Create Vite React project
npm create vite@latest expense-tracker -- --template react
cd expense-tracker

# 2. Install all dependencies
npm install react-router-dom chart.js react-chartjs-2 react-hot-toast xlsx jspdf jspdf-autotable date-fns lucide-react

# 3. Create public/data/ folder with seed JSON files
mkdir public/data
# (copy all 8 .json seed files into public/data/)

# 4. Start development server
npm run dev
# → Open http://localhost:5173

# 5. Build for production
npm run build
# → Output in dist/ folder
```

### `package.json` Key Scripts

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview",
    "lint":    "eslint . --ext js,jsx"
  }
}
```

---

## 12. MVP Definition of Done

The MVP is considered **complete** when:

- [x] User can **register** with name, email, password
- [x] User can **log in** and session persists on refresh
- [x] User can **add, edit, delete** expenses
- [x] Expense list has **real-time search** (debounced)
- [x] Expense list has **category & payment mode filter**
- [x] Dashboard shows **4 KPI cards** with correct values
- [x] **Pie chart** renders expense breakdown by category
- [x] **Bar chart** renders last 6 months expense trend
- [x] User can **set monthly budget** per category
- [x] **Red warning** appears when budget is exceeded
- [x] **CSV export** works and downloads correct data
- [x] **ProtectedRoute** blocks unauthenticated users
- [x] All data **persists in localStorage** across browser refresh
- [x] **react-hot-toast** shows success/error messages
- [x] App runs with **`npm run dev`** on `http://localhost:5173`

---

## 13. Known Limitations in MVP

| Limitation | Impact | Planned Fix |
|---|---|---|
| localStorage ~5MB limit | Large datasets may fail | v2.0: IndexedDB |
| No manager approval flow | Can't test multi-role approval | v1.2 |
| Password hashed in SHA-256 (no salt) | Weak against rainbow tables | v1.1: add salt |
| Single browser/device only | No sync across devices | v2.0: cloud backend |
| No receipt upload | Missing feature | v1.2 |
| No PDF export | Basic export only CSV | v1.1 |
| No real email alerts | Can't email budget warnings | v2.0 |

---

*Document End — MVP TECH DOC.md v2.0 (React + Vite)*
