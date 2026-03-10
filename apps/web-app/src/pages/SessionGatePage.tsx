import { authServiceBaseUrl } from '../auth/client';
import { useAuthSession } from '../auth/AuthSessionContext';

export default function SessionGatePage() {
  const { demoPersonas, error, isAuthenticated, isCustomer, isPending, signInAsDemoPersona, signOut, user } =
    useAuthSession();

  const title =
    isAuthenticated && !isCustomer ? 'Switch to a customer demo persona' : 'Choose a customer demo session';
  const description =
    isAuthenticated && !isCustomer
      ? 'This web app is intentionally scoped to customer self-service. Support and admin journeys now live in the backoffice app.'
      : 'Each persona button signs into auth-service with a seeded customer account, then the app loads /me and /me/payments through the generated SDK layer.';

  return (
    <div className="page">
      <section className="card hero-panel">
        <p className="eyebrow">Customer Access</p>
        <h2>{title}</h2>
        <p className="subhead">{description}</p>
        {isAuthenticated && user && !isCustomer ? (
          <p className="state error">
            Current session: {user.name} ({user.role}). This app only exposes customer journeys.
          </p>
        ) : null}
      </section>

      <div className="persona-grid">
        {demoPersonas.map((persona) => (
          <section key={persona.id} className="card persona-card">
            <div className="persona-header">
              <div>
                <p className="label">Demo persona</p>
                <h3>{persona.name}</h3>
              </div>
              <span className="badge badge--customer">Customer</span>
            </div>
            <div className="stack persona-meta">
              <p className="value">{persona.email}</p>
              <p className="muted">{persona.description}</p>
            </div>
            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                void signInAsDemoPersona(persona.id);
              }}
              disabled={isPending}
            >
              {isPending ? 'Starting session…' : `Use ${persona.name}`}
            </button>
          </section>
        ))}
      </div>

      <section className="card">
        <h3>Demo notes</h3>
        <div className="stack">
          <p className="muted">Auth service: {authServiceBaseUrl}</p>
          <p className="muted">The selected persona still authenticates against the real auth-service contract.</p>
          {isAuthenticated && user ? (
            <button className="button button--secondary" type="button" onClick={signOut}>
              Clear current session
            </button>
          ) : null}
          {error ? <p className="state error">Error: {error}</p> : null}
        </div>
      </section>
    </div>
  );
}
