import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateUser } from '../utils/validators';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: errs } = validateUser(form);
    if (!isValid) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(108,99,255,0.4)' }}>
            <TrendingUp size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.875rem' }}>Start tracking your expenses today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 4 characters' },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input name={f.name} type={f.type} className={`form-input${errors[f.name] ? ' error' : ''}`}
                  placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} />
                {errors[f.name] && <span className="form-error">{errors[f.name]}</span>}
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '8px', justifyContent: 'center', height: '46px' }} disabled={loading}>
              {loading ? 'Creating...' : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
