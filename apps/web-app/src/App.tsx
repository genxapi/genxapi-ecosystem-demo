import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import UserDetailsPage from './pages/UserDetailsPage';
import UsersPage from './pages/UsersPage';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link active' : 'nav-link';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">genxapi ecosystem</p>
          <h1>GenX API Ecosystem Demo</h1>
          <p className="subhead">Cross-domain user journey across users and payments services.</p>
        </div>
        <nav className="app-nav">
          <NavLink to="/" end className={linkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/users" className={linkClassName}>
            Users
          </NavLink>
          <NavLink to="/payments" className={linkClassName}>
            Payments
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </main>
    </div>
  );
}
