import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPayments, type Payment } from '../api/sdk';
import { formatCurrency, formatDateTime, getErrorMessage } from '../utils/format';

const statusOptions: Array<{ value: 'all' | Payment['status']; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const methodOptions: Array<{ value: 'all' | Payment['method']; label: string }> = [
  { value: 'all', label: 'All methods' },
  { value: 'credit_card', label: 'Credit card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'stripe', label: 'Stripe' },
];

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | Payment['status']>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | Payment['method']>('all');

  const paymentsQuery = useQuery({
    queryKey: ['payments'],
    queryFn: ({ signal }) => getPayments(signal),
  });

  const payments = paymentsQuery.data ?? [];

  const filteredPayments = useMemo(() => {
    const filtered = payments.filter((payment) => {
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
      return matchesStatus && matchesMethod;
    });

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [payments, statusFilter, methodFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Payments</h2>
          <p className="muted">All payments across users with filtering and status insights.</p>
        </div>
        <div className="toolbar">
          <select
            className="select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | Payment['status'])}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value as 'all' | Payment['method'])}
          >
            {methodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="muted">
            {filteredPayments.length} of {payments.length}
          </span>
        </div>
      </div>
      <section className="card">
        {paymentsQuery.isLoading ? <p className="state">Loading payments…</p> : null}
        {paymentsQuery.isError ? (
          <p className="state error">Error: {getErrorMessage(paymentsQuery.error)}</p>
        ) : null}
        {!paymentsQuery.isLoading && !paymentsQuery.isError && filteredPayments.length === 0 ? (
          <p className="state">No payments match the selected filters.</p>
        ) : null}
        {!paymentsQuery.isLoading && !paymentsQuery.isError && filteredPayments.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDateTime(payment.createdAt)}</td>
                    <td>
                      <Link className="link" to={`/users/${payment.userId}`}>
                        User {payment.userId}
                      </Link>
                    </td>
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
