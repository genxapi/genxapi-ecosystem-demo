import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getInternalUsers } from '../api/sdk';
import { useAuthSession } from '../auth/AuthSessionContext';
import { formatDateTime, formatLabel, getErrorMessage } from '../utils/format';

export default function UsersPage() {
  const { canViewPaymentsIndex, role } = useAuthSession();
  const usersQuery = useQuery({
    queryKey: ['internal', 'users'],
    queryFn: ({ signal }) => getInternalUsers(signal),
  });

  const users = [...(usersQuery.data ?? [])].sort((left, right) => left.id - right.id);
  const internalCount = users.filter((user) => user.role !== 'customer').length;
  const customerCount = users.filter((user) => user.role === 'customer').length;
  const inactiveCount = users.filter((user) => !user.isActive).length;

  return (
    <div className="page">
      <section className="card hero-panel">
        <p className="eyebrow">Users Workflow</p>
        <h2>{canViewPaymentsIndex ? 'Internal user directory' : 'Support case directory'}</h2>
        <p className="subhead">
          The users list is loaded from the generated users SDK via <code>/users</code>. Visible
          workflows follow the stored <code>{formatLabel(role ?? undefined)}</code> claim instead of
          treating the operations console as a public app.
        </p>
      </section>

      {usersQuery.isLoading ? (
        <section className="card">
          <p className="state">Loading internal users…</p>
        </section>
      ) : null}

      {usersQuery.isError ? (
        <section className="card">
          <p className="state error">Error: {getErrorMessage(usersQuery.error)}</p>
        </section>
      ) : null}

      {!usersQuery.isLoading && !usersQuery.isError ? (
        <>
          <div className="summary-grid">
            <section className="card summary-card">
              <p className="label">Users</p>
              <p className="value">{users.length}</p>
              <p className="muted">All internal records returned by the current demo dataset.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Customers</p>
              <p className="value">{customerCount}</p>
              <p className="muted">Customer accounts appear here for internal case lookup.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Internal staff</p>
              <p className="value">{internalCount}</p>
              <p className="muted">Support and admin personas are visible in the same directory.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Inactive</p>
              <p className="value">{inactiveCount}</p>
              <p className="muted">
                {canViewPaymentsIndex
                  ? 'Admins can pivot from this directory into the global payments queue.'
                  : 'Support stays on user-focused workflows and user payment drill-downs.'}
              </p>
            </section>
          </div>

          {users.length === 0 ? (
            <section className="card">
              <h3>No users found</h3>
              <p className="state">The internal users route returned an empty dataset.</p>
            </section>
          ) : (
            <section className="card">
              <div className="card-header">
                <div>
                  <h3>Internal records</h3>
                  <p className="muted">
                    Open a user to inspect account details and route-aligned payment history.
                  </p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge badge--${user.role}`}>{formatLabel(user.role)}</span>
                        </td>
                        <td>
                          <span className={user.isActive ? 'badge badge--active' : 'badge badge--inactive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatDateTime(user.createdAt)}</td>
                        <td>
                          <Link className="inline-link" to={`/users/${user.id}`}>
                            Open record
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
