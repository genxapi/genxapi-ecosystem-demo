import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getAuthHealth, type AuthHealth } from '../api/auth';
import {
  getPaymentsHealth,
  getUsersHealth,
  type PaymentsHealth,
  type UsersHealth,
} from '../api/sdk';
import { formatDateTime, getErrorMessage } from '../utils/format';

type HealthQuery = UseQueryResult<AuthHealth | UsersHealth | PaymentsHealth, Error>;

const ServiceCard = ({ title, query }: { title: string; query: HealthQuery }) => {
  const status = query.isError ? 'down' : query.data?.status ?? 'unknown';
  const statusClass = status === 'ok' ? 'status ok' : 'status down';
  const lastUpdated = query.dataUpdatedAt ? formatDateTime(query.dataUpdatedAt) : '—';
  const errorMessage = query.isError ? getErrorMessage(query.error) : null;

  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
        <span className={statusClass}>{status}</span>
      </div>
      <p className="muted">Last updated: {lastUpdated}</p>
      {query.isLoading ? <p className="state">Checking status…</p> : null}
      {errorMessage ? <p className="state error">Error: {errorMessage}</p> : null}
    </section>
  );
};

export default function DashboardPage() {
  const authHealthQuery = useQuery({
    queryKey: ['health', 'auth'],
    queryFn: ({ signal }) => getAuthHealth(signal),
  });

  const usersHealthQuery = useQuery({
    queryKey: ['health', 'users'],
    queryFn: ({ signal }) => getUsersHealth(signal),
  });

  const paymentsHealthQuery = useQuery({
    queryKey: ['health', 'payments'],
    queryFn: ({ signal }) => getPaymentsHealth(signal),
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2>Service Health</h2>
        <p className="muted">Live checks from auth, users, and payments services.</p>
      </div>
      <div className="grid">
        <ServiceCard title="Auth service" query={authHealthQuery} />
        <ServiceCard title="Users service" query={usersHealthQuery} />
        <ServiceCard title="Payments service" query={paymentsHealthQuery} />
      </div>
    </div>
  );
}
