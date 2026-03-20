import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, TrendingUp, Star, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FLOATING_STATS = [
  { label: 'Employability Score', value: '87%', color: '#6366F1', icon: TrendingUp },
  { label: 'Skills Assessed',     value: '24',  color: '#10B981', icon: Star      },
  { label: 'Interview Ready',     value: '92%', color: '#F59E0B', icon: Shield    },
];

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState(null);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-root">
      {/* ── LEFT PANEL ─────────────────────────────────── */}
      <div className="signin-left">
        {/* Background layers */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-lines" />

        {/* Logo */}
        <div className="signin-logo">
          <div className="signin-logo-icon">
            <Zap className="zap-icon" />
          </div>
          <div>
            <p className="signin-brand">EmployIQ</p>
            <p className="signin-tagline-small">Intelligence Portal</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="signin-hero">
          <p className="signin-eyebrow">Student Dashboard</p>
          <h1 className="signin-headline">
            Know your<br />
            <span className="signin-headline-accent">strengths.</span><br />
            Land your role.
          </h1>
          <p className="signin-desc">
            AI-powered assessments that map your skills, track your growth,
            and connect you with the right opportunities.
          </p>
        </div>

        {/* Floating stat cards */}
        <div className="signin-stats">
          {FLOATING_STATS.map(({ label, value, color, icon: Icon }, i) => (
            <div
              key={label}
              className="stat-chip"
              style={{ '--chip-color': color, animationDelay: `${i * 0.15}s` }}
            >
              <div className="stat-chip-icon" style={{ background: `${color}22` }}>
                <Icon style={{ width: 14, height: 14, color }} />
              </div>
              <div>
                <p className="stat-chip-value">{value}</p>
                <p className="stat-chip-label">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <p className="signin-footer-left">Trusted by 12,000+ students across 200 campuses</p>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────── */}
      <div className="signin-right">
        <div className="signin-form-wrap">
          {/* Mobile logo */}
          <div className="signin-mobile-logo">
            <div className="signin-logo-icon signin-logo-icon--sm">
              <Zap style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <span className="signin-brand-mobile">EmployIQ</span>
          </div>

          {/* Heading */}
          <div className="signin-form-header">
            <h2 className="signin-form-title">Welcome back</h2>
            <p className="signin-form-sub">Sign in to your student portal</p>
          </div>

          {/* Social / SSO buttons */}
          {/* <div className="signin-sso">
            <button type="button" className="sso-btn">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
            <button type="button" className="sso-btn">
              <MicrosoftIcon />
              <span>Continue with Microsoft</span>
            </button>
          </div>

          <div className="signin-divider">
            <span className="signin-divider-line" />
            <span className="signin-divider-text">or sign in with email</span>
            <span className="signin-divider-line" />
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="signin-form" noValidate>
            {/* Email */}
            <div className={`field-group ${focused === 'email' ? 'field-focused' : ''}`}>
              <label className="field-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className={`field-group ${focused === 'password' ? 'field-focused' : ''}`}>
              <div className="field-label-row">
                <label className="field-label" htmlFor="password">Password</label>
                <button type="button" className="forgot-link">Forgot password?</button>
              </div>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="field-input field-input--pass"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass
                    ? <EyeOff style={{ width: 16, height: 16 }} />
                    : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="remember-row">
              <div
                className={`checkbox ${remember ? 'checkbox--checked' : ''}`}
                onClick={() => setRemember(v => !v)}
                role="checkbox"
                aria-checked={remember}
                tabIndex={0}
                onKeyDown={e => e.key === ' ' && setRemember(v => !v)}
              >
                {remember && (
                  <svg viewBox="0 0 12 10" fill="none" className="check-mark">
                    <polyline points="1,5 4.5,8.5 11,1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="remember-label">Keep me signed in</span>
            </label>

            {/* Error message */}
            {error && (
              <div className="error-banner">
                <AlertCircle style={{ width: 14, height: 14, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* CTA */}
            <button
              type="submit"
              className={`signin-btn ${loading ? 'signin-btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="signin-register">
            New student?{' '}
            <button type="button" className="register-link">Create an account</button>
          </p>
        </div>
      </div>

      <style>{`
        /* ── Root layout ── */
        .signin-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── Left panel ── */
        .signin-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: #0F172A;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem;
        }
        @media (min-width: 1024px) {
          .signin-left { display: flex; width: 52%; }
        }

        /* Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f140 0%, transparent 70%);
          top: -120px; left: -80px;
          animation: driftA 12s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #10b98130 0%, transparent 70%);
          bottom: 80px; right: -60px;
          animation: driftB 15s ease-in-out infinite alternate;
        }
        .orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #f59e0b25 0%, transparent 70%);
          top: 55%; left: 40%;
          animation: driftA 18s ease-in-out infinite alternate-reverse;
        }
        @keyframes driftA { from { transform: translate(0,0); } to { transform: translate(40px,30px); } }
        @keyframes driftB { from { transform: translate(0,0); } to { transform: translate(-30px,-40px); } }

        /* Grid lines */
        .grid-lines {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Logo */
        .signin-logo {
          display: flex; align-items: center; gap: 0.75rem; z-index: 1;
          animation: fadeUp 0.5s ease-out both;
        }
        .signin-logo-icon {
          width: 2.5rem; height: 2.5rem; border-radius: 0.75rem;
          background: #6366F1;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px #6366f150;
          flex-shrink: 0;
        }
        .zap-icon { width: 1.25rem; height: 1.25rem; color: #fff; }
        .signin-brand {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 800; font-size: 1.125rem; color: #fff; line-height: 1;
        }
        .signin-tagline-small {
          font-size: 0.625rem; color: #64748B; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase; margin-top: 2px;
        }

        /* Hero */
        .signin-hero { z-index: 1; animation: fadeUp 0.6s 0.1s ease-out both; }
        .signin-eyebrow {
          font-size: 0.75rem; color: #6366F1; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1rem;
        }
        .signin-headline {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: clamp(2.2rem, 3.5vw, 3rem);
          font-weight: 800; color: #fff; line-height: 1.12;
          letter-spacing: -0.03em; margin: 0 0 1.25rem;
        }
        .signin-headline-accent {
          background: linear-gradient(135deg, #6366F1, #818CF8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .signin-desc {
          font-size: 0.9375rem; color: #94A3B8; line-height: 1.65; max-width: 380px;
        }

        /* Floating stat chips */
        .signin-stats {
          display: flex; flex-direction: column; gap: 0.75rem;
          z-index: 1; animation: fadeUp 0.6s 0.2s ease-out both;
        }
        .stat-chip {
          display: flex; align-items: center; gap: 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 0.875rem 1.125rem;
          backdrop-filter: blur(8px);
          animation: slideRight 0.5s ease-out both;
          transition: background 0.2s;
        }
        .stat-chip:hover { background: rgba(255,255,255,0.07); }
        .stat-chip-icon {
          width: 2rem; height: 2rem; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .stat-chip-value {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 1.125rem; font-weight: 700; color: #fff; line-height: 1;
        }
        .stat-chip-label { font-size: 0.75rem; color: #64748B; margin-top: 2px; }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Footer left */
        .signin-footer-left {
          font-size: 0.75rem; color: #334155; z-index: 1;
          animation: fadeUp 0.5s 0.35s ease-out both;
        }

        /* ── Right panel ── */
        .signin-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          background: #fff;
          padding: 2rem 1.5rem;
        }
        .signin-form-wrap {
          width: 100%; max-width: 420px;
          animation: fadeUp 0.55s 0.05s ease-out both;
        }

        /* Mobile logo */
        .signin-mobile-logo {
          display: flex; align-items: center; gap: 0.625rem; margin-bottom: 2.5rem;
        }
        @media (min-width: 1024px) { .signin-mobile-logo { display: none; } }
        .signin-logo-icon--sm {
          width: 2rem; height: 2rem; border-radius: 8px;
        }
        .signin-brand-mobile {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-weight: 800; font-size: 1rem; color: #1E293B;
        }

        /* Form heading */
        .signin-form-header { margin-bottom: 1.75rem; }
        .signin-form-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 1.75rem; font-weight: 800; color: #0F172A;
          letter-spacing: -0.03em; line-height: 1.2; margin: 0 0 0.375rem;
        }
        .signin-form-sub { font-size: 0.9375rem; color: #64748B; margin: 0; }

        /* SSO buttons */
        .signin-sso { display: flex; flex-direction: column; gap: 0.625rem; margin-bottom: 1.5rem; }
        .sso-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.625rem;
          border: 1.5px solid #E2E8F0; border-radius: 10px;
          padding: 0.6875rem 1rem; background: #fff;
          font-size: 0.875rem; font-weight: 600; color: #334155;
          cursor: pointer; transition: all 0.18s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .sso-btn:hover { border-color: #CBD5E1; background: #F8FAFC; }
        .sso-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

        /* Divider */
        .signin-divider {
          display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1.5rem;
        }
        .signin-divider-line { flex: 1; height: 1px; background: #E2E8F0; }
        .signin-divider-text { font-size: 0.75rem; color: #94A3B8; font-weight: 500; white-space: nowrap; }

        /* Form */
        .signin-form { display: flex; flex-direction: column; gap: 1.125rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-label {
          font-size: 0.8125rem; font-weight: 600; color: #374151;
        }
        .field-label-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .field-input {
          width: 100%; padding: 0.6875rem 0.875rem;
          border: 1.5px solid #E2E8F0; border-radius: 10px;
          font-size: 0.9375rem; color: #0F172A;
          font-family: 'DM Sans', system-ui, sans-serif;
          outline: none; background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #CBD5E1; }
        .field-input:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .field-input--pass { padding-right: 2.75rem; }
        .password-wrap { position: relative; }
        .toggle-pass {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94A3B8; display: flex; align-items: center; padding: 0.25rem;
          transition: color 0.15s;
        }
        .toggle-pass:hover { color: #6366F1; }
        .forgot-link {
          font-size: 0.8125rem; font-weight: 600; color: #6366F1;
          background: none; border: none; cursor: pointer; padding: 0;
          transition: opacity 0.15s;
        }
        .forgot-link:hover { opacity: 0.75; }

        /* Checkbox */
        .remember-row { display: flex; align-items: center; gap: 0.625rem; cursor: pointer; margin-top: -0.125rem; }
        .checkbox {
          width: 1.125rem; height: 1.125rem; border-radius: 5px; flex-shrink: 0;
          border: 1.5px solid #CBD5E1; background: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; cursor: pointer;
        }
        .checkbox--checked { background: #6366F1; border-color: #6366F1; }
        .check-mark { width: 12px; height: 10px; }
        .remember-label { font-size: 0.875rem; color: #475569; font-weight: 500; }

        /* Error banner */
        .error-banner {
          display: flex; align-items: center; gap: 0.5rem;
          background: #FEF2F2; border: 1px solid #FECACA;
          border-radius: 8px; padding: 0.625rem 0.875rem;
          font-size: 0.8125rem; color: #DC2626; font-weight: 500;
          animation: fadeUp 0.25s ease-out both;
        }

        /* CTA */
        .signin-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          color: #fff; font-weight: 700; font-size: 0.9375rem;
          padding: 0.8125rem 1rem; border-radius: 10px; border: none;
          cursor: pointer; margin-top: 0.25rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
          transition: all 0.2s;
        }
        .signin-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .signin-btn:active:not(:disabled) { transform: translateY(0); }
        .signin-btn--loading { opacity: 0.85; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Register */
        .signin-register {
          text-align: center; font-size: 0.875rem; color: #64748B; margin-top: 1.25rem;
        }
        .register-link {
          font-weight: 700; color: #6366F1; background: none; border: none;
          cursor: pointer; padding: 0; transition: opacity 0.15s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .register-link:hover { opacity: 0.75; }

        /* Shared animation */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Inline SVG icons for SSO ── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
    </svg>
  );
}
