import type { PropsWithChildren } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthSession } from './auth/AuthSessionContext';
import AccessDeniedPage from './pages/AccessDeniedPage';
import PaymentsPage from './pages/PaymentsPage';
import SessionGatePage from './pages/SessionGatePage';
import UserDetailsPage from './pages/UserDetailsPage';
import UsersPage from './pages/UsersPage';
import { formatLabel } from './utils/format';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link active' : 'nav-link';

const InternalRoute = ({ children }: PropsWithChildren) => {
  const { isInternal } = useAuthSession();

  if (!isInternal) {
    return <SessionGatePage />;
  }

  return children;
};

const AdminRoute = ({ children }: PropsWithChildren) => {
  const { isAdmin, isInternal } = useAuthSession();

  if (!isInternal) {
    return <SessionGatePage />;
  }

  if (!isAdmin) {
    return <AccessDeniedPage />;
  }

  return children;
};

export default function App() {
  const {
    canViewPaymentsIndex,
    isAuthenticated,
    isInternal,
    role,
    signOut,
    user,
  } = useAuthSession();
  const navigationItems = [
    {
      to: '/users',
      label: 'Users',
      description: 'Browse internal records and open case detail.',
      isVisible: isInternal,
    },
    {
      to: '/payments',
      label: 'Payments',
      description: 'Global payment queue for admin sessions.',
      isVisible: canViewPaymentsIndex,
    },
  ].filter((item) => item.isVisible);
  const defaultRoute = isInternal ? '/users' : '/session';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">GX</div>
          <div className="stack">
            <p className="eyebrow">GenX API Internal Surface</p>
            <h1>Operations Console</h1>
            <p className="sidebar-copy">
              Internal operations consumer built on the same published contracts and generated SDK
              packages as the customer surfaces.
            </p>
          </div>
        </div>

        <section className="sidebar-card">
          <p className="label">Navigation</p>
          {navigationItems.length > 0 ? (
            <nav className="app-nav">
              {navigationItems.map((item) => (
                <NavLink key={item.to} className={linkClassName} to={item.to}>
                  <span className="nav-link__label">{item.label}</span>
                  <span className="nav-link__help">{item.description}</span>
                </NavLink>
              ))}
            </nav>
          ) : (
            <p className="nav-empty">Choose a support or admin persona to unlock internal workflows.</p>
          )}
        </section>

        <section className="sidebar-card session-card">
          <p className="label">Demo session</p>
          {isAuthenticated && user ? (
            <div className="stack">
              <div className="session-topline">
                <p className="session-user">{user.name}</p>
                <span className={`badge badge--${user.role}`}>{formatLabel(user.role)}</span>
              </div>
              <p className="muted">{user.email}</p>
              <p className="muted">
                {isInternal
                  ? canViewPaymentsIndex
                    ? 'Admin can browse users, user-level payments, and the global payments queue.'
                    : 'Support can browse users and user-level payment history.'
                  : 'Customer claims are not accepted in this internal app.'}
              </p>
              <button className="button button--secondary" type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          ) : (
            <div className="stack">
              <p className="session-user">No internal persona selected</p>
              <p className="muted">
                This app only exposes internal support and admin journeys. Customer self-service
                remains in <code>web-app</code>.
              </p>
            </div>
          )}
        </section>

        <section className="sidebar-card runtime-card">
          <p className="label">SDK boundary</p>
          <p className="value">Runtime-configured SDK packages</p>
          <p className="muted">
            Base URLs and bearer token injection stay at the app boundary instead of inside page
            components.
          </p>
          {role ? <p className="muted">Current claim: {formatLabel(role)}</p> : null}
        </section>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate replace to={defaultRoute} />} />
          <Route path="/session" element={<SessionGatePage />} />
          <Route
            path="/users"
            element={
              <InternalRoute>
                <UsersPage />
              </InternalRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <InternalRoute>
                <UserDetailsPage />
              </InternalRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <AdminRoute>
                <PaymentsPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate replace to={defaultRoute} />} />
        </Routes>
      </main>
    </div>
  );
}
