import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getInternalPayments } from '../api/sdk';
import { formatCurrency, formatDateTime, formatLabel, getErrorMessage } from '../utils/format';

export default function PaymentsPage() {
  const paymentsQuery = useQuery({
    queryKey: ['internal', 'payments'],
    queryFn: ({ signal }) => getInternalPayments(signal),
  });

  const payments = [...(paymentsQuery.data ?? [])].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currency = payments[0]?.currency ?? 'USD';
  const pendingCount = payments.filter((payment) => payment.status === 'pending').length;
  const uniqueUsersCount = new Set(payments.map((payment) => payment.userId)).size;

  return (
    <div className="page">
      <section className="card hero-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Payments Workflow</p>
            <h2>Admin payments queue</h2>
            <p className="subhead">
              This screen uses the generated payments SDK via <code>/payments</code> and is only
              exposed to admin claims inside the operations console.
            </p>
          </div>
          <div className="toolbar">
            <Link className="button button--secondary" to="/users">
              Back to users
            </Link>
          </div>
        </div>
      </section>

      {paymentsQuery.isLoading ? (
        <section className="card">
          <p className="state">Loading internal payments…</p>
        </section>
      ) : null}

      {paymentsQuery.isError ? (
        <section className="card">
          <p className="state error">Error: {getErrorMessage(paymentsQuery.error)}</p>
        </section>
      ) : null}

      {!paymentsQuery.isLoading && !paymentsQuery.isError ? (
        <>
          <div className="summary-grid">
            <section className="card summary-card">
              <p className="label">Payments</p>
              <p className="value">{payments.length}</p>
              <p className="muted">Global records returned by the internal payments route.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Total amount</p>
              <p className="value">{formatCurrency(totalAmount, currency)}</p>
              <p className="muted">Sum of every payment record in the queue.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Users touched</p>
              <p className="value">{uniqueUsersCount}</p>
              <p className="muted">Distinct owning users represented in this list.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Pending</p>
              <p className="value">{pendingCount}</p>
              <p className="muted">Pending payments remain visible only to admin in this UI.</p>
            </section>
          </div>

          {payments.length === 0 ? (
            <section className="card">
              <h3>No payments found</h3>
              <p className="state">The internal payments route returned an empty dataset.</p>
            </section>
          ) : (
            <section className="card">
              <div className="card-header">
                <div>
                  <h3>Payment records</h3>
                  <p className="muted">
                    Use the linked user ids to pivot back into the internal user workflow.
                  </p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Payment</th>
                      <th>User</th>
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
                        <td>#{payment.id}</td>
                        <td>
                          <Link className="inline-link" to={`/users/${payment.userId}`}>
                            User {payment.userId}
                          </Link>
                        </td>
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
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
