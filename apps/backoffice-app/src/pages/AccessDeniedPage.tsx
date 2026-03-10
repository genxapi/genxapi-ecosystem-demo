import { Link } from 'react-router-dom';
import { useAuthSession } from '../auth/AuthSessionContext';
import { formatLabel } from '../utils/format';

export default function AccessDeniedPage() {
  const { signOut, user } = useAuthSession();

  return (
    <div className="page">
      <section className="card hero-panel">
        <p className="eyebrow">Restricted View</p>
        <h2>Payments queue is reserved for admins</h2>
        <p className="subhead">
          Support sessions can investigate a specific user and their payments, but the global
          payments browse is intentionally limited to the admin persona in this app.
        </p>
      </section>

      <section className="card">
        <div className="stack">
          <p className="muted">
            Current session:{' '}
            {user ? `${user.name} (${formatLabel(user.role)})` : 'No internal persona selected.'}
          </p>
          <div className="toolbar">
            <Link className="button button--primary" to="/users">
              Go to users
            </Link>
            <button className="button button--secondary" type="button" onClick={signOut}>
              Switch persona
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
