import { useState, type FormEvent } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { authServiceBaseUrl } from './auth/client';
import { useAuthSession } from './auth/AuthSessionContext';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import UserDetailsPage from './pages/UserDetailsPage';
import UsersPage from './pages/UsersPage';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link active' : 'nav-link';

export default function App() {
  const { error, isAuthenticated, isInternalViewer, isPending, signOut, user, login } =
    useAuthSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const didLogin = await login({ email, password });

    if (didLogin) {
      setPassword('');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="hero-copy">
          <p className="eyebrow">genxapi ecosystem</p>
          <h1>GenX API Ecosystem Demo</h1>
          <p className="subhead">
            Auth-service login feeding the role-aware users and payments SDKs.
          </p>
        </div>
        <div className="header-actions">
          <nav className="app-nav">
            <NavLink to="/" end className={linkClassName}>
              Dashboard
            </NavLink>
            {isInternalViewer ? (
              <NavLink to="/users" className={linkClassName}>
                Users
              </NavLink>
            ) : null}
            {isInternalViewer ? (
              <NavLink to="/payments" className={linkClassName}>
                Payments
              </NavLink>
            ) : null}
          </nav>
          <section className="session-card">
            <p className="eyebrow">Auth Session</p>
            {isAuthenticated && user ? (
              <div className="stack">
                <p className="session-user">{user.name}</p>
                <p className="muted">{user.email}</p>
                <div className="toolbar">
                  <span className="badge">{user.role}</span>
                  <button className="button button--secondary" type="button" onClick={signOut}>
                    Sign out
                  </button>
                </div>
                <p className="session-note">
                  {isInternalViewer
                    ? 'Internal routes are available after login for support and admin users.'
                    : 'Customer /me and /me/payments flows land in Phase 3.'}
                </p>
              </div>
            ) : (
              <form className="stack" onSubmit={handleLogin}>
                <label className="form-field">
                  <span>Email</span>
                  <input
                    className="input"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="form-field">
                  <span>Password</span>
                  <input
                    className="input"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your password"
                  />
                </label>
                <button className="button button--primary" type="submit" disabled={isPending}>
                  {isPending ? 'Signing in…' : 'Sign in'}
                </button>
                <p className="muted">Auth service: {authServiceBaseUrl}</p>
                <p className="session-note">
                  Use one of the seeded demo credentials documented for the auth service.
                </p>
              </form>
            )}
            {error ? <p className="state error">Error: {error}</p> : null}
          </section>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/users"
            element={isInternalViewer ? <UsersPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/users/:id"
            element={isInternalViewer ? <UserDetailsPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/payments"
            element={isInternalViewer ? <PaymentsPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
