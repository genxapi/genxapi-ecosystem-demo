import {
  backofficeAuthServiceBaseUrl,
  backofficePaymentsServiceBaseUrl,
  backofficeUsersServiceBaseUrl,
} from './runtime';

export default function App() {
  return (
    <div className="app">
      <header>
        <p className="eyebrow">genxapi ecosystem</p>
        <h1>Backoffice App</h1>
        <p className="subhead">
          Internal console starter using the shared runtime config contract.
        </p>
      </header>
      <section className="card">
        <h2>Runtime Config</h2>
        <ul>
          <li>Auth service base URL: {backofficeAuthServiceBaseUrl}</li>
          <li>Users SDK base URL: {backofficeUsersServiceBaseUrl}</li>
          <li>Payments SDK base URL: {backofficePaymentsServiceBaseUrl}</li>
        </ul>
      </section>
      <section className="card">
        <h2>Adoption Model</h2>
        <ul>
          <li>Authenticate against auth-service and keep that session in the app shell.</li>
          <li>Create the users and payments SDKs once from the stored token provider.</li>
          <li>Keep app-specific login UX outside the generated SDK packages.</li>
        </ul>
      </section>
    </div>
  );
}
