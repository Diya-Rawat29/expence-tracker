# 📋 Product Requirements Document (PRD)
## Expense Management System — ExpenseTracker Pro
### Built with React 18 + Vite 5 + JSON localStorage

**Version:** 2.0  
**Date:** 13 March 2026  
**Product Manager:** Development Team  
**Status:** Approved for Development

---

## 📋 Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [Target Users & Personas](#4-target-users--personas)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Feature Specifications](#7-feature-specifications)
8. [User Flows (React)](#8-user-flows-react)
9. [UI/UX Requirements](#9-uiux-requirements)
10. [Data Requirements](#10-data-requirements)
11. [Constraints & Assumptions](#11-constraints--assumptions)
12. [Success Metrics (KPIs)](#12-success-metrics-kpis)
13. [Release Plan](#13-release-plan)
14. [Risk Assessment](#14-risk-assessment)
15. [Glossary](#15-glossary)

---

## 1. Product Overview

### 1.1 Product Name
**ExpenseTracker Pro** — A Web-Based Expense Management System

### 1.2 One-Line Description
> A zero-backend, React + Vite SPA that lets individuals and small teams track expenses, manage budgets, generate reports, and export data — all powered by JSON localStorage with no server required.

### 1.3 Product Summary

| Property | Value |
|---|---|
| Product Type | React SPA (Single-Page Application) |
| Build Tool | Vite 5 (Fast builds + HMR) |
| Framework | React 18 |
| Routing | React Router DOM v6 |
| State Management | React Context API + useReducer |
| Data Storage | JSON + localStorage |
| Backend | None (fully client-side) |
| Authentication | localStorage session (SHA-256 hashed passwords) |
| Deployment | Vercel / Netlify / GitHub Pages after `npm run build` |
| Target Audience | Individuals, freelancers, students, small businesses |

---

## 2. Problem Statement

### 2.1 The Problem
Millions of individuals and small teams:
- Cannot track **where their money goes** easily
- Exceed their budgets with **no visual warnings**
- Need **expense reports** for reimbursement / tax
- Want a **free, private tool** that doesn't require bank linking

### 2.2 Existing Solutions & Gaps

| Solution | Problems |
|---|---|
| Excel/Google Sheets | Manual, no real-time UI, no approval workflow |
| Mint / YNAB / QuickBooks | Paid, requires bank account linking, heavy setup |
| Paper | Lost data, no analytics |
| Generic SaaS tools | Overkill, expensive subscriptions |

### 2.3 Our Solution
**ExpenseTracker Pro** — a fast React app with a premium dark UI, real-time charts, budget alerts, multi-role approval, and full CSV/PDF export. All data stays locally in the browser (localStorage). No server, no subscription.

---

## 3. Product Vision & Goals

### 3.1 Vision Statement
> *"To empower every individual and small team to take control of their finances through a stunning, fast, and serverless React experience."*

### 3.2 Product Goals

| Goal | Metric | Target |
|---|---|---|
| Ease of Use | Time to add first expense | < 2 minutes |
| Speed | Vite dev server start | < 500ms |
| Speed | Page navigation (React Router) | Instant (< 50ms) |
| Offline Support | Works without internet (after first load) | ✅ Yes |
| Zero Cost | No subscription needed | ✅ Yes |
| Data Privacy | No external server | ✅ Yes (localStorage only) |

### 3.3 Product Principles
1. **React-First** — Everything is a component, everything is reactive
2. **Data Privacy** — No data leaves the device
3. **Vite Speed** — Dev experience must be blazing fast (HMR, builds)
4. **Zero Backend** — No server setup required for any feature
5. **Premium UI** — Dark mode, glassmorphism, smooth animations

---

## 4. Target Users & Personas

### 4.1 Persona 1: Rahul — The Freelancer 🧑‍💻

| | |
|---|---|
| Age | 26 |
| Job | Freelance Designer |
| Tech | React developer — comfortable with npm |
| Pain | Can't separate project expenses from personal |
| Goal | Monthly breakdown, CSV for taxes |

**Needs from the app:**
- Quick React form for expense entry
- Category-wise pie chart
- CSV export for CA / tax filing

---

### 4.2 Persona 2: Priya — The Small Business Owner 👩‍💼

| | |
|---|---|
| Age | 34 |
| Job | Boutique owner (8 employees) |
| Tech | Medium — uses web apps daily |
| Pain | Employee reimbursements are chaotic |
| Goal | Employees submit → she approves → report |

**Needs:**
- Employee role can submit expenses
- Manager role can approve/reject with comment
- Monthly report download (Excel)

---

### 4.3 Persona 3: Arjun — The Student 🎓

| | |
|---|---|
| Age | 21 |
| Job | Engineering student |
| Tech | High — uses React in college projects |
| Pain | Runs out of pocket money by month-end |
| Goal | Track daily spending, stay in budget |

**Needs:**
- Mobile-friendly React UI
- Budget warning when nearing limit
- Works offline in hostel (no WiFi)

---

### 4.4 Persona 4: Sunita — Finance Manager 👩‍💼

| | |
|---|---|
| Age | 42 |
| Job | Finance Manager at a startup |
| Tech | Medium |
| Pain | No centralized team expense system |
| Goal | View all, approve all, generate tax reports |

**Needs:**
- Admin panel with all user expenses
- PDF reports for accountant
- Multi-level approval (Employee → Manager → Admin)

---

## 5. Functional Requirements

### 5.1 Authentication Module

| Req ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | User registers with Name, Email, Password | Must Have |
| AUTH-02 | User logs in; session stored via `db.setSession()` | Must Have |
| AUTH-03 | `<ProtectedRoute>` redirects unauthenticated to `/` | Must Have |
| AUTH-04 | User logs out; `db.clearSession()` + `navigate('/')` | Must Have |
| AUTH-05 | 3 roles: Admin, Manager, Employee enforced in routes + data | Must Have |
| AUTH-06 | Password stored as SHA-256 hash (SubtleCrypto API) | Must Have |
| AUTH-07 | Session survives page refresh (localStorage) | Must Have |
| AUTH-08 | Profile page: update name, theme, currency | Should Have |

---

### 5.2 Expense Management Module

| Req ID | Requirement | Priority |
|---|---|---|
| EXP-01 | Add expense (title, amount, date, category, payment, notes) | Must Have |
| EXP-02 | Edit expense using pre-filled form at `/expenses/edit/:id` | Must Have |
| EXP-03 | Delete with confirmation via `window.confirm` or Modal | Must Have |
| EXP-04 | Paginated table (10 per page) with `useMemo` | Must Have |
| EXP-05 | Real-time search (debounced 300ms) via SearchBar component | Must Have |
| EXP-06 | Filter by category, payment mode, date range | Must Have |
| EXP-07 | Sort by date or amount | Should Have |
| EXP-08 | Auto-generate ID: `exp_${Date.now()}` | Must Have |
| EXP-09 | Employee sees only own expenses; Admin sees all | Must Have |
| EXP-10 | Submit expense for approval (status = 'Pending') | Should Have |
| EXP-11 | Export filtered list to CSV via SheetJS | Must Have |

---

### 5.3 Income Module

| Req ID | Requirement | Priority |
|---|---|---|
| INC-01 | Add income (source, amount, date, notes) via `IncomeContext` | Should Have |
| INC-02 | Edit and delete income records | Should Have |
| INC-03 | Dashboard: Net Balance = total income – total expenses | Should Have |

---

### 5.4 Budget Module

| Req ID | Requirement | Priority |
|---|---|---|
| BUD-01 | Set budget limit per category per month via `BudgetContext` | Must Have |
| BUD-02 | Calculate `spent = sum(expenses by category, month)` reactively | Must Have |
| BUD-03 | `<ProgressBar>` shows `spent/limit` percentage with color states | Must Have |
| BUD-04 | React state triggers warning when `spent >= limit * 0.9` | Must Have |
| BUD-05 | `toast.error()` fires when budget is fully exceeded | Must Have |
| BUD-06 | Edit/reset budget limit | Should Have |

---

### 5.5 Category Module

| Req ID | Requirement | Priority |
|---|---|---|
| CAT-01 | Seed 10 default categories from `public/data/categories.json` | Must Have |
| CAT-02 | Add custom categories with name + lucide-react icon + color | Must Have |
| CAT-03 | Edit / delete (guard: not if expenses reference it) | Should Have |
| CAT-04 | Category options in expense form dropdown | Must Have |

---

### 5.6 Approval Workflow Module

| Req ID | Requirement | Priority |
|---|---|---|
| APR-01 | Employee submits expense → status becomes 'Pending' | Should Have |
| APR-02 | Manager sees pending list in `/approvals` (protected route) | Should Have |
| APR-03 | Manager Approve/Reject → dispatches to `ApprovalContext` | Should Have |
| APR-04 | Employee gets notification on decision | Should Have |
| APR-05 | Full approval history stored in `ems_approvals` | Could Have |

---

### 5.7 Reports & Analytics Module

| Req ID | Requirement | Priority |
|---|---|---|
| RPT-01 | `<PieChart>` on dashboard (react-chartjs-2 Pie) | Must Have |
| RPT-02 | `<BarChart>` on dashboard (last 6 months trend) | Must Have |
| RPT-03 | `/reports` page with `<LineChart>` + category breakdown table | Should Have |
| RPT-04 | Custom date range filter on reports page | Should Have |
| RPT-05 | Export filtered expenses to CSV (SheetJS) | Must Have |
| RPT-06 | Export to Excel `.xlsx` | Should Have |
| RPT-07 | Export to PDF (jsPDF + jspdf-autotable) | Could Have |

---

### 5.8 Notifications Module

| Req ID | Requirement | Priority |
|---|---|---|
| NOT-01 | `react-hot-toast` for all action feedbacks (success/error) | Must Have |
| NOT-02 | Navbar bell icon with unread count badge | Should Have |
| NOT-03 | `/notifications` page: list, mark read, delete | Should Have |
| NOT-04 | System creates notification on approval/rejection | Should Have |

---

### 5.9 Admin Module

| Req ID | Requirement | Priority |
|---|---|---|
| ADM-01 | `/admin` protected route (admin role only) | Should Have |
| ADM-02 | List all users, change roles, activate/deactivate | Should Have |
| ADM-03 | View all expenses across all users | Should Have |
| ADM-04 | Settings: currency, theme, tax rate | Should Have |
| ADM-05 | Backup: export all localStorage data as JSON | Should Have |

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements

| Requirement | Target |
|---|---|
| Vite dev server cold start | < 500ms |
| Page navigation (React Router) | Instant — no network request |
| List render (100 expenses) | < 100ms (React virtual DOM) |
| Search debounce response | < 50ms after 300ms delay |
| Chart render (react-chartjs-2) | < 200ms |
| `npm run build` output size | < 500KB gzipped |

### 6.2 Usability Requirements

| Requirement | Target |
|---|---|
| Time to add first expense | < 3 minutes for new user |
| Clicks to add expense from dashboard | ≤ 2 clicks |
| Responsive | Desktop (1024px+) and Tablet (768px+) |
| Accessibility | ARIA labels on all form fields + buttons |
| Form validation feedback | Inline, before submission |

### 6.3 Reliability Requirements

| Requirement | Target |
|---|---|
| localStorage persistence | Survives browser close/reopen |
| React state sync | Context state always matches localStorage |
| Error boundaries | `<ErrorBoundary>` wraps each page |
| Try-catch in all `db.js` operations | Graceful failure with toast |

### 6.4 Security Requirements

| Requirement | Implementation |
|---|---|
| Password hashing | SHA-256 via SubtleCrypto (Web Crypto API) |
| Route protection | `<ProtectedRoute>` via React Router v6 |
| Role enforcement | `requiredRole` prop on `<ProtectedRoute>` |
| XSS | React JSX escapes all string expressions by default |
| Session expiry | Store `loginTime`; check on each route load |

### 6.5 Browser Compatibility

| Browser | Min Version | Support |
|---|---|---|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Internet Explorer | Any | ❌ Not supported (React 18 drops IE) |

---

## 7. Feature Specifications

### 7.1 ExpenseForm Component Spec

**Route:** `/expenses/add` (add) and `/expenses/edit/:id` (edit)  
**Component:** `AddExpensePage.jsx`

| Field | Input Type | Validation | Required |
|---|---|---|---|
| Title | `<input type="text">` max 100 | Not empty | ✅ |
| Amount | `<input type="number">` | > 0 | ✅ |
| Date | `<input type="date">` | Not future | ✅ |
| Category | `<select>` from CategoryContext | Valid id | ✅ |
| Payment Mode | `<select>` (Cash/UPI/Card/NetBanking) | Required | ✅ |
| Notes | `<textarea>` max 500 | Optional | ❌ |

**State Pattern:**
```jsx
const [form, setForm] = useState({ title:'', amount:'', date:today, category:'', paymentMode:'Cash', notes:'' });
const [errors, setErrors] = useState({});

const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

const handleSubmit = async (e) => {
  e.preventDefault();
  const { isValid, errors } = validateExpense(form);
  if (!isValid) return setErrors(errors);
  isEdit ? updateExpense(id, form) : addExpense(form);
  toast.success(isEdit ? 'Expense updated!' : 'Expense added!');
  navigate('/expenses');
};
```

---

### 7.2 PieChart Component Spec

```jsx
// components/charts/PieChart.jsx
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data }) {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      data: data.map(d => d.amount),
      backgroundColor: data.map(d => d.color),
      borderWidth: 2,
      borderColor: '#242736'
    }]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { color: '#A0A3B1' } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString('en-IN')}`
        }
      }
    }
  };
  
  return <Pie data={chartData} options={options} />;
}
```

---

### 7.3 ProtectedRoute Component Spec

```jsx
// components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser } = useAuth();
  
  // Not logged in
  if (!currentUser) return <Navigate to="/" replace />;
  
  // Role check
  const rank = { admin: 3, manager: 2, employee: 1 };
  if (requiredRole && rank[currentUser.role] < rank[requiredRole]) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}
```

---

## 8. User Flows (React)

### 8.1 New User Onboarding

```
Open http://localhost:5173/
        │
  AuthContext: no session in localStorage
        │
        ▼
<LoginPage /> renders
  → Link: "Register"
        │
        ▼
<RegisterPage />
  → Fill form → submit
  → AuthContext.register(data)
  → dispatch({ type: 'REGISTER', payload: user })
  → db.set('ems_users', [...users, newUser])
  → toast.success('Account created!')
  → navigate('/')
        │
        ▼
<LoginPage /> → login → navigate('/dashboard')
        │
        ▼
<DashboardPage /> (empty state)
  → "No expenses yet — Add your first one!"
  → CTA button → navigate('/expenses/add')
        │
        ▼
<AddExpensePage /> → fill → submit
        │
        ▼
navigate('/dashboard')
  → Charts now show first data point! 🎉
```

### 8.2 Daily Expense Entry

```
User is logged in → on /dashboard
  ↓ Clicks sidebar "Expenses" → navigate('/expenses')
  ↓ Clicks "+ Add Expense" button
  ↓ <AddExpensePage> renders
  ↓ Fills: "Coffee" | ₹80 | Food | Cash
  ↓ Clicks Submit
  ↓ addExpense(form) → dispatch → reducer → state updated
  ↓ useEffect → db.set('ems_expenses', newExpenses)  [localStorage sync]
  ↓ toast.success('Expense added! ✅')
  ↓ navigate('/expenses')
  ↓ ExpensesPage re-renders with new entry at top
```

### 8.3 Month-End Report

```
User navigates to /reports
  ↓ Selects month: March 2026 | All Categories
  ↓ useMemo recalculates:
      totalExpenses: ₹18,420
      categoryBreakdown: Food(35%), Travel(20%), Tech(15%)...
  ↓ <PieChart> + <LineChart> re-render
  ↓ User clicks "Export Excel"
  ↓ exportToExcel(filteredExpenses)
  ↓ File: expenses_March_2026.xlsx downloaded
```

---

## 9. UI/UX Requirements

### 9.1 Design System (React + CSS Variables)

| Token | Value |
|---|---|
| Primary font | Poppins (Google Fonts via `index.html`) |
| Primary color | `#6C63FF` |
| Background (dark) | `#0F1117` |
| Card background | `#242736` |
| Success | `#2EC4B6` |
| Danger | `#FF4757` |
| Warning | `#FFCC00` |
| Border radius (cards) | `12px` |
| Default theme | Dark Mode |

### 9.2 React Layout Structure

```
<App>
  <Toaster position="bottom-right" /> {/* react-hot-toast */}
  <RouterProvider>
    <Layout>           {/* Sidebar + Navbar + <Outlet> */}
      <Sidebar />      {/* Navigation links */}
      <Navbar />       {/* Bell icon + User avatar + Theme toggle */}
      <main>
        <Outlet />     {/* Route page renders here */}
      </main>
    </Layout>
  </RouterProvider>
</App>
```

### 9.3 Animation & Micro-interactions

| Element | Animation |
|---|---|
| Sidebar items | `transition: background 0.2s, transform 0.2s` on hover |
| KPI Cards | `transform: translateY(-4px)` on hover |
| Expense rows | `background: rgba(108,99,255,0.05)` on row hover |
| Modal | `fadeIn` + `slideUp` on open |
| Progress bar | `transition: width 0.6s ease` |
| Charts | Chart.js built-in animation on mount |
| Page transitions | `React` key-based remount with CSS fade |

### 9.4 Responsive Breakpoints

| Screen | Sidebar | Layout |
|---|---|---|
| ≥ 1200px (Desktop) | Always visible (250px) | Full layout |
| 768px–1199px (Tablet) | Collapsed (icons only) | Content full width |
| < 768px (Mobile) | Hidden; hamburger toggle | Single column |

---

## 10. Data Requirements

### 10.1 React State + localStorage Sync Pattern

Every Context follows this pattern:

```jsx
// 1. Initialize state from localStorage on mount
const init = db.getAll('expenses');
const [state, dispatch] = useReducer(reducer, { expenses: init, filters: {}, page: 1 });

// 2. Sync to localStorage on every state change
useEffect(() => {
  db.set('ems_expenses', state.expenses);
}, [state.expenses]);

// 3. Components consume via hook
const { expenses } = useExpenses(); // reactive to state changes
```

### 10.2 Storage Limits

| Data | Max Records | Approx Size |
|---|---|---|
| Expenses | ~2,000 | ~1MB |
| Users | ~50 | ~50KB |
| Categories | ~50 | ~20KB |
| Notifications | ~200 | ~100KB |
| Total safe limit | — | < 4MB of 5MB |

### 10.3 Data Privacy
- ✅ Zero data leaves the browser
- ✅ No Google Analytics / tracking
- ✅ No cookies (localStorage only)
- ✅ User can export all data (JSON backup)
- ✅ User can delete all data (Settings → Factory Reset)

---

## 11. Constraints & Assumptions

| Constraint | Detail |
|---|---|
| No backend | Pure React + localStorage app |
| React 18 | No IE support |
| Vite required | `npm run dev` to start |
| localStorage limit | ~5MB per origin |
| No real-time sync | Single device only |
| CDN fonts | Google Fonts needed on first load |

**Assumptions:**
1. User has Node.js 18+ and npm installed
2. Modern browser (Chrome / Firefox / Edge)
3. Primary use: personal or small team (< 50 users per device)
4. Internet only needed for initial CDN resources

---

## 12. Success Metrics (KPIs)

| Metric | Target |
|---|---|
| Time to add 1st expense (new user) | < 3 min |
| Users setting at least 1 budget | > 60% |
| Users exporting at least once | > 40% |
| Dashboard visits per week | > 3× |
| Vite build size (gzipped) | < 500KB |
| `npm run dev` startup | < 1 second |

---

## 13. Release Plan

| Version | Timeline | Features |
|---|---|---|
| **v1.0 (MVP)** | Week 1–2 | Auth, Expense CRUD, Dashboard charts, Budget, CSV export |
| **v1.1** | Week 3–4 | Income module, PDF export, Profile settings, Theme toggle |
| **v1.2** | Week 5–6 | Approval workflow, Receipt upload, Recurring expenses |
| **v2.0** | Month 2+ | Admin panel, PWA, IndexedDB, Cloud backend option |

---

## 14. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| localStorage data loss on clear | Medium | High | Export button on dashboard + periodic reminder |
| Vite build breaks on bad import | Low | Medium | ESLint + strict import paths |
| Context re-render performance | Medium | Medium | `useMemo` + `useCallback` on expensive computations |
| Chart.js + react-chartjs-2 version mismatch | Low | High | Pin exact versions in `package.json` |
| localStorage 5MB exceeded | Low | High | Usage meter in Settings page |
| React Router v6 breaking change | Low | Medium | Lock to specific minor version |

---

## 15. Glossary

| Term | Definition |
|---|---|
| React | JavaScript library for building component-based UIs |
| Vite | Modern build tool with lightning-fast HMR |
| SPA | Single-Page Application — navigation without full page reload |
| React Router | Library for client-side routing in React apps |
| Context API | React's built-in state management (no Redux needed) |
| useReducer | React hook for complex state with action-based updates |
| useMemo | React hook to memoize expensive computed values |
| HMR | Hot Module Replacement — instant UI update on file save |
| localStorage | Browser API for key-value storage (~5MB per origin) |
| JSON seed | Initial data loaded into localStorage on first app run |
| CRUD | Create, Read, Update, Delete |
| RBAC | Role-Based Access Control |

---

*Document End — PRD.md v2.0 (React + Vite)*
