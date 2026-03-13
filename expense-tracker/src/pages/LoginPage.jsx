import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/db';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@demo.com', password: 'admin' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true });
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(108,99,255,0.4)' }}>
            <TrendingUp size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>ExpenseTracker Pro</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Sign in to manage your expenses</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input name="password" type={showPw ? 'text' : 'password'} className="form-input"
                placeholder="Enter password" value={form.password} onChange={handleChange}
                style={{ paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: '12px', top: '36px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '8px', justifyContent: 'center', height: '46px' }} disabled={loading}>
              {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <hr className="divider" />
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Demo Credentials:</p>
            <p>👑 Admin: admin@demo.com / admin</p>
            <p>👤 Employee: jane@demo.com / admin</p>
            <p>🏢 Manager: manager@demo.com / admin</p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
