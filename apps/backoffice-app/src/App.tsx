import { backofficeDemoPersona, backofficeSdkRuntime } from './demo-runtime';

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
          <li>Persona: {backofficeDemoPersona.label} ({backofficeDemoPersona.role})</li>
          <li>Users SDK base URL: {backofficeSdkRuntime.users.baseUrl}</li>
          <li>Payments SDK base URL: {backofficeSdkRuntime.payments.baseUrl}</li>
        </ul>
      </section>
      <section className="card">
        <h2>Adoption Model</h2>
        <ul>
          <li>Configure the SDK once with a base URL and token provider.</li>
          <li>Reuse the same runtime contract as `web-app` and `mobile-app`.</li>
          <li>Keep app-specific auth UX outside the generated SDK packages.</li>
        </ul>
      </section>
    </div>
  );
}
