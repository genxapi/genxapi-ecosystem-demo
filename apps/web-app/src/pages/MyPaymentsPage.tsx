import { useQuery } from '@tanstack/react-query';
import { getMyPayments } from '../api/sdk';
import { formatCurrency, formatDateTime, formatLabel, getErrorMessage } from '../utils/format';

export default function MyPaymentsPage() {
  const paymentsQuery = useQuery({
    queryKey: ['me', 'payments'],
    queryFn: ({ signal }) => getMyPayments(signal),
  });

  const payments = [...(paymentsQuery.data ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currency = payments[0]?.currency ?? 'USD';
  const completedCount = payments.filter((payment) => payment.status === 'completed').length;
  const refundedCount = payments.filter((payment) => payment.status === 'refunded').length;
  const latestPayment = payments[0] ?? null;

  return (
    <div className="page">
      <section className="card hero-panel">
        <p className="eyebrow">My Payments</p>
        <h2>Your payment history</h2>
        <p className="subhead">
          Payment activity is loaded from the generated payments SDK via <code>/me/payments</code>,
          so the app only requests records owned by the authenticated customer.
        </p>
      </section>

      {paymentsQuery.isLoading ? (
        <section className="card">
          <p className="state">Loading your payments…</p>
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
              <p className="label">Payment records</p>
              <p className="value">{payments.length}</p>
              <p className="muted">Everything shown here belongs to your customer account.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Total amount</p>
              <p className="value">{formatCurrency(totalAmount, currency)}</p>
              <p className="muted">Sum of all returned payment records.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Completed</p>
              <p className="value">{completedCount}</p>
              <p className="muted">Successful payments currently on your account.</p>
            </section>
            <section className="card summary-card">
              <p className="label">Latest activity</p>
              <p className="value">{latestPayment ? formatLabel(latestPayment.status) : 'No activity'}</p>
              <p className="muted">
                {latestPayment ? formatDateTime(latestPayment.createdAt) : 'No payments found yet.'}
              </p>
            </section>
          </div>

          {payments.length === 0 ? (
            <section className="card">
              <h3>No payments yet</h3>
              <p className="state">
                Your account does not have any payment history in the demo dataset.
              </p>
            </section>
          ) : (
            <section className="card">
              <div className="card-header">
                <div>
                  <h3>Payment activity</h3>
                  <p className="muted">Only your records are shown here. Refunded payments: {refundedCount}.</p>
                </div>
              </div>
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
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}
