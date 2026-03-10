import type { PropsWithChildren } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthSession } from './auth/AuthSessionContext';
import MyPaymentsPage from './pages/MyPaymentsPage';
import MyProfilePage from './pages/MyProfilePage';
import SessionGatePage from './pages/SessionGatePage';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link active' : 'nav-link';

const CustomerRoute = ({ children }: PropsWithChildren) => {
  const { isCustomer } = useAuthSession();

  if (!isCustomer) {
    return <SessionGatePage />;
  }

  return children;
};

export default function App() {
  const { isAuthenticated, isCustomer, signOut, user } = useAuthSession();

  return (
    <div className="app">
      <header className="app-header">
        <div className="hero-copy">
          <p className="eyebrow">GenX API Customer Surface</p>
          <h1>Customer Portal</h1>
          <p className="subhead">
            Customer-facing consumer that adopts runtime-configured SDK packages generated from
            published service contracts, loading only the authenticated user&apos;s profile and payments.
          </p>
        </div>
        <div className="header-actions">
          {isCustomer ? (
            <nav className="app-nav">
              <NavLink to="/profile" className={linkClassName}>
                My Profile
              </NavLink>
              <NavLink to="/payments" className={linkClassName}>
                My Payments
              </NavLink>
            </nav>
          ) : null}
          <section className="session-card">
            <p className="eyebrow">Demo Session</p>
            {isAuthenticated && user && isCustomer ? (
              <div className="stack">
                <p className="session-user">{user.name}</p>
                <p className="muted">{user.email}</p>
                <div className="toolbar">
                  <span className="badge badge--customer">Customer</span>
                  <button className="button button--secondary" type="button" onClick={signOut}>
                    Sign out
                  </button>
                </div>
                <p className="session-note">
                  This session drives the customer-only navigation and powers `/me` plus
                  `/me/payments` through the generated SDK package layer.
                </p>
              </div>
            ) : (
              <div className="stack">
                <p className="session-user">
                  {isAuthenticated && user ? user.name : 'No customer session selected'}
                </p>
                {isAuthenticated && user ? <p className="muted">{user.email}</p> : null}
                <p className="session-note">
                  {isAuthenticated && user
                    ? 'This app no longer exposes internal support or admin flows. Pick a customer persona below.'
                    : 'Choose one of the seeded customer personas below to bootstrap the demo session.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={isCustomer ? <Navigate to="/profile" replace /> : <SessionGatePage />} />
          <Route
            path="/profile"
            element={
              <CustomerRoute>
                <MyProfilePage />
              </CustomerRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <CustomerRoute>
                <MyPaymentsPage />
              </CustomerRoute>
            }
          />
          <Route path="*" element={<Navigate to={isCustomer ? '/profile' : '/'} replace />} />
        </Routes>
      </main>
    </div>
  );
}
