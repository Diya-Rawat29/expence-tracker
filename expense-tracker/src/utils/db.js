// src/utils/db.js — localStorage JSON Database Engine

const KEYS = {
  users: 'ems_users',
  expenses: 'ems_expenses',
  income: 'ems_income',
  categories: 'ems_categories',
  budgets: 'ems_budgets',
  notifications: 'ems_notifications',
  settings: 'ems_settings',
  currentUser: 'ems_currentUser',
  initialized: 'ems_initialized',
};

export const db = {
  KEYS,

  getAll(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.settings)) || {};
    } catch { return {}; }
  },

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        window.dispatchEvent(new CustomEvent('storage-full'));
      }
      return false;
    }
  },

  setSettings(data) {
    localStorage.setItem(KEYS.settings, JSON.stringify(data));
  },

  setSession(user) {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  },

  getSession() {
    try { return JSON.parse(localStorage.getItem(KEYS.currentUser)); }
    catch { return null; }
  },

  clearSession() {
    localStorage.removeItem(KEYS.currentUser);
  },

  isInitialized() {
    return !!localStorage.getItem(KEYS.initialized);
  },

  async seed() {
    // Always re-fetch users so new accounts added to users.json are loaded
    try {
      const res = await fetch(`/data/users.json`);
      const json = await res.json();
      const users = json['users'] || json.data || (Array.isArray(json) ? json : []);
      this.set(KEYS['users'], users);
    } catch (e) {
      if (!this.getAll(KEYS['users']).length) this.set(KEYS['users'], []);
    }

    // Only seed other data once (on first run)
    if (this.isInitialized()) return;

    const files = ['expenses', 'income', 'categories', 'budgets', 'notifications'];
    await Promise.all(
      files.map(async (name) => {
        try {
          const res = await fetch(`/data/${name}.json`);
          const json = await res.json();
          const data = json[name] || json.data || (Array.isArray(json) ? json : []);
          this.set(KEYS[name], data);
        } catch (e) {
          this.set(KEYS[name], []);
        }
      })
    );
    try {
      const res = await fetch('/data/settings.json');
      const settings = await res.json();
      this.setSettings(settings);
    } catch { }
    localStorage.setItem(KEYS.initialized, 'true');
  },

  exportAll() {
    const backup = {};
    ['users','expenses','income','categories','budgets','notifications'].forEach(name => {
      backup[name] = this.getAll(KEYS[name]);
    });
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ems_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },

  getUsagePercent() {
    let total = 0;
    Object.values(KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) total += val.length * 2;
    });
    return ((total / (5 * 1024 * 1024)) * 100).toFixed(1);
  },
};
