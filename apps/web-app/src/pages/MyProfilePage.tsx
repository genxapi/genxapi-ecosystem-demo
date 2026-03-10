import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/sdk';
import { useAuthSession } from '../auth/AuthSessionContext';
import { formatDateTime, formatLabel, getErrorMessage } from '../utils/format';

export default function MyProfilePage() {
  const { user } = useAuthSession();
  const profileQuery = useQuery({
    queryKey: ['me'],
    queryFn: ({ signal }) => getMyProfile(signal),
  });

  return (
    <div className="page">
      <section className="card hero-panel">
        <p className="eyebrow">My Profile</p>
        <h2>{profileQuery.data ? `Welcome back, ${profileQuery.data.firstName}.` : 'Your account at a glance'}</h2>
        <p className="subhead">
          The customer app loads your account from the generated users SDK via <code>/me</code>.
          There is no cross-user profile navigation in this experience.
        </p>
      </section>

      {profileQuery.isLoading ? (
        <section className="card">
          <p className="state">Loading your profile…</p>
        </section>
      ) : null}

      {profileQuery.isError ? (
        <section className="card">
          <p className="state error">Error: {getErrorMessage(profileQuery.error)}</p>
        </section>
      ) : null}

      {!profileQuery.isLoading && !profileQuery.isError && profileQuery.data ? (
        <div className="grid">
          <section className="card">
            <div className="card-header">
              <h3>Account details</h3>
              <span className="badge badge--customer">{formatLabel(profileQuery.data.role)}</span>
            </div>
            <dl className="detail-list">
              <div className="detail-row">
                <dt className="label">Full name</dt>
                <dd className="value">{`${profileQuery.data.firstName} ${profileQuery.data.lastName}`}</dd>
              </div>
              <div className="detail-row">
                <dt className="label">Email</dt>
                <dd className="value">{profileQuery.data.email}</dd>
              </div>
              <div className="detail-row">
                <dt className="label">Status</dt>
                <dd className="value">
                  <span
                    className={profileQuery.data.isActive ? 'badge badge--active' : 'badge badge--inactive'}
                  >
                    {profileQuery.data.isActive ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
              <div className="detail-row">
                <dt className="label">Member since</dt>
                <dd className="value">{formatDateTime(profileQuery.data.createdAt)}</dd>
              </div>
              <div className="detail-row">
                <dt className="label">Customer id</dt>
                <dd className="value">User {profileQuery.data.id}</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <h3>Session scope</h3>
            <div className="stack">
              <div className="summary-card">
                <p className="label">Authenticated claims</p>
                <p className="value">{user?.name ?? profileQuery.data.firstName}</p>
                <p className="muted">
                  Navigation is enabled from the stored customer claims returned by auth-service.
                </p>
              </div>
              <div className="summary-card">
                <p className="label">Visible screens</p>
                <p className="value">My Profile and My Payments</p>
                <p className="muted">
                  Internal users and broad payment routes have been removed from the customer app.
                </p>
              </div>
              <div className="summary-card">
                <p className="label">Runtime adoption</p>
                <p className="value">Generated SDK + app session</p>
                <p className="muted">
                  Base URLs and bearer token injection stay in the runtime-configured SDK layer.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
