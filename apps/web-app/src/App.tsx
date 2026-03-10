import {
  DEMO_PERSONAS,
  type DemoPersonaId,
} from '@genxapi/ecosystem-demo-runtime';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useDemoSession } from './auth/DemoSessionContext';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import UserDetailsPage from './pages/UserDetailsPage';
import UsersPage from './pages/UsersPage';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link active' : 'nav-link';

export default function App() {
  const { isAuthenticated, isInternalViewer, persona, setPersonaId, signOut } = useDemoSession();

  return (
    <div className="app">
      <header className="app-header">
        <div className="hero-copy">
          <p className="eyebrow">genxapi ecosystem</p>
          <h1>GenX API Ecosystem Demo</h1>
          <p className="subhead">
            Role-aware SDK adoption across users and payments services.
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
            <p className="eyebrow">Demo Session</p>
            <div className="toolbar">
              <select
                className="select"
                value={persona?.id ?? ''}
                onChange={(event) =>
                  setPersonaId((event.target.value || null) as DemoPersonaId | null)
                }
              >
                <option value="">Signed out</option>
                {DEMO_PERSONAS.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.label} · {candidate.role}
                  </option>
                ))}
              </select>
              <button className="button button--secondary" type="button" onClick={signOut}>
                Clear
              </button>
            </div>
            <p className="muted">
              {persona ? persona.description : 'No bearer token is being sent to the secured routes.'}
            </p>
            <p className="session-note">
              {isAuthenticated && isInternalViewer
                ? 'Internal routes are available in this pre-Phase-3 shell.'
                : 'Customer /me and /me/payments flows land in Phase 3.'}
            </p>
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
