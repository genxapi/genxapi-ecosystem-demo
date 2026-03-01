import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUsers, type User } from '../api/sdk';
import { formatDateTime, getErrorMessage } from '../utils/format';

const matchesQuery = (user: User, query: string) => {
  if (!query) {
    return true;
  }

  const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
  return fullName.includes(query) || user.email.toLowerCase().includes(query);
};

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: ({ signal }) => getUsers(signal),
  });

  const users = usersQuery.data ?? [];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = useMemo(
    () => users.filter((user) => matchesQuery(user, normalizedSearch)),
    [users, normalizedSearch]
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Users</h2>
          <p className="muted">Browse users and jump into their payment history.</p>
        </div>
        <div className="toolbar">
          <input
            className="input"
            type="search"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span className="muted">
            {filteredUsers.length} of {users.length}
          </span>
        </div>
      </div>
      <section className="card">
        {usersQuery.isLoading ? <p className="state">Loading users…</p> : null}
        {usersQuery.isError ? (
          <p className="state error">Error: {getErrorMessage(usersQuery.error)}</p>
        ) : null}
        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 ? (
          <p className="state">No users match your search.</p>
        ) : null}
        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="clickable"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/users/${user.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        navigate(`/users/${user.id}`);
                      }
                    }}
                  >
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={user.isActive ? 'badge badge--active' : 'badge badge--inactive'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDateTime(user.createdAt)}</td>
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
