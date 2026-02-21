export default function App() {
  return (
    <div className="app">
      <header>
        <p className="eyebrow">genxapi ecosystem</p>
        <h1>Web App</h1>
        <p className="subhead">
          Starter UI for the demo. This can call the users and payments services once APIs are wired.
        </p>
      </header>
      <section className="card">
        <h2>Swagger Endpoints</h2>
        <ul>
          <li>Users: http://localhost:3001/swagger</li>
          <li>Payments: http://localhost:3002/swagger</li>
        </ul>
      </section>
    </div>
  );
}
