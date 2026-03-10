import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getInternalUser, getInternalUserPayments } from '../api/sdk';
import { useAuthSession } from '../auth/AuthSessionContext';
import { formatCurrency, formatDateTime, formatLabel, getErrorMessage } from '../utils/format';

export default function UserDetailsPage() {
  const { userId } = useParams();
  const { canViewPaymentsIndex, canViewUserPayments } = useAuthSession();
  const parsedUserId = Number(userId);
  const isValidUserId = Number.isInteger(parsedUserId) && parsedUserId > 0;

  const userQuery = useQuery({
    queryKey: ['internal', 'users', parsedUserId],
    enabled: isValidUserId,
    queryFn: ({ signal }) => getInternalUser(parsedUserId, signal),
  });

  const paymentsQuery = useQuery({
    queryKey: ['internal', 'users', parsedUserId, 'payments'],
    enabled: isValidUserId && canViewUserPayments,
    queryFn: ({ signal }) => getInternalUserPayments(parsedUserId, signal),
  });

  const payments = [...(paymentsQuery.data ?? [])].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currency = payments[0]?.currency ?? 'USD';
  const title = userQuery.data
    ? `${userQuery.data.firstName} ${userQuery.data.lastName}`
    : isValidUserId
      ? `User ${parsedUserId}`
      : 'Unknown user';

  return (
    <div className="page">
      <section className="card hero-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">User Detail</p>
            <h2>{title}</h2>
            <p className="subhead">
              This internal record comes from the generated users SDK via <code>/users/:userId</code>.
              User-scoped payments load through <code>/users/:userId/payments</code>.
            </p>
          </div>
          <div className="toolbar">
            <Link className="button button--secondary" to="/users">
              Back to users
            </Link>
            {canViewPaymentsIndex ? (
              <Link className="button button--primary" to="/payments">
                Open payments queue
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {!isValidUserId ? (
        <section className="card">
          <p className="state error">The user id in the URL is not valid.</p>
        </section>
      ) : null}

      {isValidUserId && userQuery.isLoading ? (
        <section className="card">
          <p className="state">Loading user record…</p>
        </section>
      ) : null}

      {isValidUserId && userQuery.isError ? (
        <section className="card">
          <p className="state error">Error: {getErrorMessage(userQuery.error)}</p>
        </section>
      ) : null}

      {isValidUserId && !userQuery.isLoading && !userQuery.isError && userQuery.data ? (
        <>
          <div className="grid">
            <section className="card">
              <div className="card-header">
                <h3>Account details</h3>
                <span className={`badge badge--${userQuery.data.role}`}>
                  {formatLabel(userQuery.data.role)}
                </span>
              </div>
              <dl className="detail-list">
                <div className="detail-row">
                  <dt className="label">Full name</dt>
                  <dd className="value">{`${userQuery.data.firstName} ${userQuery.data.lastName}`}</dd>
                </div>
                <div className="detail-row">
                  <dt className="label">Email</dt>
                  <dd className="value">{userQuery.data.email}</dd>
                </div>
                <div className="detail-row">
                  <dt className="label">Status</dt>
                  <dd className="value">
                    <span className={userQuery.data.isActive ? 'badge badge--active' : 'badge badge--inactive'}>
                      {userQuery.data.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
                <div className="detail-row">
                  <dt className="label">Created</dt>
                  <dd className="value">{formatDateTime(userQuery.data.createdAt)}</dd>
                </div>
                <div className="detail-row">
                  <dt className="label">User id</dt>
                  <dd className="value">User {userQuery.data.id}</dd>
                </div>
              </dl>
            </section>

            <section className="card">
              <h3>Operational scope</h3>
              <div className="stack">
                <div className="summary-card">
                  <p className="label">Current workflow</p>
                  <p className="value">
                    {canViewPaymentsIndex ? 'Admin operations' : 'Support investigation'}
                  </p>
                  <p className="muted">
                    Claims control both the visible navigation and the route guards in this app.
                  </p>
                </div>
                <div className="summary-card">
                  <p className="label">User payments</p>
                  <p className="value">{payments.length}</p>
                  <p className="muted">
                    {payments.length > 0
                      ? `Total amount: ${formatCurrency(totalAmount, currency)}`
                      : 'No payments returned for this user.'}
                  </p>
                </div>
                <div className="summary-card">
                  <p className="label">Global payments queue</p>
                  <p className="value">{canViewPaymentsIndex ? 'Available' : 'Hidden for support'}</p>
                  <p className="muted">
                    Support stays on user-scoped lookups. Admin can also browse the full payments list.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {canViewUserPayments ? (
            <section className="card">
              <div className="card-header">
                <div>
                  <h3>User payments</h3>
                  <p className="muted">
                    Internal payment history returned for user {userQuery.data.id}.
                  </p>
                </div>
              </div>

              {paymentsQuery.isLoading ? <p className="state">Loading user payments…</p> : null}
              {paymentsQuery.isError ? (
                <p className="state error">Error: {getErrorMessage(paymentsQuery.error)}</p>
              ) : null}
              {!paymentsQuery.isLoading && !paymentsQuery.isError && payments.length === 0 ? (
                <p className="state">This user does not have payment history in the demo dataset.</p>
              ) : null}
              {!paymentsQuery.isLoading && !paymentsQuery.isError && payments.length > 0 ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Created</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{formatDateTime(payment.createdAt)}</td>
                          <td>{formatCurrency(payment.amount, payment.currency)}</td>
                          <td>
                            <span className={`badge badge--${payment.status}`}>
                              {formatLabel(payment.status)}
                            </span>
                          </td>
                          <td>{formatLabel(payment.method)}</td>
                          <td>
                            <code>{payment.transactionId}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
