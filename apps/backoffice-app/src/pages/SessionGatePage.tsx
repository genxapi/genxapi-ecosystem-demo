import { useNavigate, Link } from 'react-router-dom';
import { useAuthSession } from '../auth/AuthSessionContext';
import {
  backofficeAuthServiceBaseUrl,
  backofficePaymentsServiceBaseUrl,
  backofficeUsersServiceBaseUrl,
} from '../runtime';
import { formatLabel } from '../utils/format';

export default function SessionGatePage() {
  const navigate = useNavigate();
  const { demoPersonas, error, isAuthenticated, isInternal, isPending, signInAsDemoPersona, signOut, user } =
    useAuthSession();

  const title = isInternal
    ? 'Internal session ready'
    : isAuthenticated
      ? 'Switch to an internal persona'
      : 'Choose an internal demo session';
  const description = isInternal
    ? 'This backoffice app authenticates against auth-service, then routes internal users and payments calls through the generated SDK layer.'
    : isAuthenticated
      ? 'Customer claims are not valid here. Pick a support or admin persona to unlock internal workflows.'
      : 'Each button signs into auth-service with a seeded support or admin account. The app does not build a separate login product flow.';

  return (
    <div className="page">
      <section className="card hero-panel">
        <p className="eyebrow">Internal Access</p>
        <h2>{title}</h2>
        <p className="subhead">{description}</p>
        {isAuthenticated && user && !isInternal ? (
          <p className="state error">
            Current session: {user.name} ({formatLabel(user.role)}). Customer claims are blocked in
            the backoffice app.
          </p>
        ) : null}
        {isInternal && user ? (
          <div className="toolbar">
            <Link className="button button--primary" to="/users">
              Continue to operations
            </Link>
            <button className="button button--secondary" type="button" onClick={signOut}>
              Clear session
            </button>
          </div>
        ) : null}
      </section>

      <div className="persona-grid">
        {demoPersonas.map((persona) => {
          const isCurrent = isInternal && user?.email === persona.email;

          return (
            <section
              key={persona.id}
              className={isCurrent ? 'card persona-card persona-card--active' : 'card persona-card'}
            >
              <div className="persona-header">
                <div>
                  <p className="label">Demo persona</p>
                  <h3>{persona.name}</h3>
                </div>
                <span className={`badge badge--${persona.role}`}>{formatLabel(persona.role)}</span>
              </div>
              <div className="stack persona-meta">
                <p className="value">{persona.email}</p>
                <p className="muted">{persona.description}</p>
              </div>
              <button
                className="button button--primary"
                type="button"
                onClick={async () => {
                  const didSignIn = await signInAsDemoPersona(persona.id);

                  if (didSignIn) {
                    navigate('/users');
                  }
                }}
                disabled={isPending || isCurrent}
              >
                {isCurrent ? 'Current session' : isPending ? 'Starting session…' : `Use ${persona.name}`}
              </button>
            </section>
          );
        })}
      </div>

      <section className="card">
        <h3>Runtime notes</h3>
        <div className="stack">
          <p className="muted">Auth service: {backofficeAuthServiceBaseUrl}</p>
          <p className="muted">Users SDK base URL: {backofficeUsersServiceBaseUrl}</p>
          <p className="muted">Payments SDK base URL: {backofficePaymentsServiceBaseUrl}</p>
          <p className="muted">
            This app stays on internal routes such as <code>/users</code>, <code>/users/:id</code>,
            and <code>/payments</code>. Customer-only <code>/me</code> flows remain in{' '}
            <code>web-app</code>.
          </p>
          {isAuthenticated && user && !isInternal ? (
            <button className="button button--secondary" type="button" onClick={signOut}>
              Remove invalid session
            </button>
          ) : null}
          {error ? <p className="state error">Error: {error}</p> : null}
        </div>
      </section>
    </div>
  );
}
