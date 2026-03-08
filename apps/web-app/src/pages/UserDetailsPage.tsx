import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getUser, getUserPayments, type Payment } from '../api/sdk';
import { formatCurrency, formatDateTime, getErrorMessage } from '../utils/format';

const buildStatusCounts = (payments: Payment[]) =>
  payments.reduce(
    (acc, payment) => {
      acc[payment.status] += 1;
      return acc;
    },
    {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
    } as Record<Payment['status'], number>
  );

export default function UserDetailsPage() {
  const params = useParams();
  const userId = Number(params.id);
  const hasValidId = Number.isFinite(userId);

  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: ({ signal }) => getUser(userId, signal),
    enabled: hasValidId,
  });

  const paymentsQuery = useQuery({
    queryKey: ['payments', 'user', userId],
    queryFn: ({ signal }) => getUserPayments(userId, signal),
    enabled: hasValidId,
  });

  const payments = paymentsQuery.data ?? [];
  const statusCounts = useMemo(() => buildStatusCounts(payments), [payments]);
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currency = payments[0]?.currency ?? 'USD';
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!hasValidId) {
    return (
      <section className="card">
        <p className="state error">Invalid user id.</p>
      </section>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link className="link" to="/users">
            ← Back to users
          </Link>
          <h2>User profile</h2>
          <p className="muted">User details and payment activity.</p>
        </div>
      </div>

      {userQuery.isLoading ? <p className="state">Loading user…</p> : null}
      {userQuery.isError ? (
        <p className="state error">Error: {getErrorMessage(userQuery.error)}</p>
      ) : null}

      {!userQuery.isLoading && !userQuery.isError && userQuery.data ? (
        <div className="grid">
          <section className="card">
            <h3>Profile</h3>
            <div className="stack">
              <div>
                <p className="label">Name</p>
                <p className="value">{`${userQuery.data.firstName} ${userQuery.data.lastName}`}</p>
              </div>
              <div>
                <p className="label">Email</p>
                <p className="value">{userQuery.data.email}</p>
              </div>
              <div>
                <p className="label">Role</p>
                <p className="value">{userQuery.data.role}</p>
              </div>
              <div>
                <p className="label">Status</p>
                <p className="value">
                  <span
                    className={
                      userQuery.data.isActive ? 'badge badge--active' : 'badge badge--inactive'
                    }
                  >
                    {userQuery.data.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div>
                <p className="label">Created</p>
                <p className="value">{formatDateTime(userQuery.data.createdAt)}</p>
              </div>
            </div>
          </section>
          <section className="card">
            <h3>Insights</h3>
            <div className="insights">
              <div className="insight">
                <p className="label">Total payments</p>
                <p className="value">{payments.length}</p>
              </div>
              <div className="insight">
                <p className="label">Total amount</p>
                <p className="value">{formatCurrency(totalAmount, currency)}</p>
              </div>
              <div className="insight">
                <p className="label">Completed</p>
                <p className="value">{statusCounts.completed}</p>
              </div>
              <div className="insight">
                <p className="label">Pending</p>
                <p className="value">{statusCounts.pending}</p>
              </div>
              <div className="insight">
                <p className="label">Failed</p>
                <p className="value">{statusCounts.failed}</p>
              </div>
              <div className="insight">
                <p className="label">Refunded</p>
                <p className="value">{statusCounts.refunded}</p>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <section className="card">
        <div className="card-header">
          <h3>Payments</h3>
          {paymentsQuery.isLoading ? <span className="muted">Loading…</span> : null}
        </div>
        {paymentsQuery.isError ? (
          <p className="state error">Error: {getErrorMessage(paymentsQuery.error)}</p>
        ) : null}
        {!paymentsQuery.isLoading && !paymentsQuery.isError && payments.length === 0 ? (
          <p className="state">No payments found for this user.</p>
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
                {sortedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDateTime(payment.createdAt)}</td>
                    <td>{formatCurrency(payment.amount, payment.currency)}</td>
                    <td>
                      <span className={`badge badge--${payment.status}`}>{payment.status}</span>
                    </td>
                    <td>{payment.method}</td>
                    <td>{payment.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
