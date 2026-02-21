export default function App() {
  return (
    <div className="app">
      <header>
        <p className="eyebrow">genxapi ecosystem</p>
        <h1>Backoffice App</h1>
        <p className="subhead">
          Internal console starter. Connect to payments + users services as the demo grows.
        </p>
      </header>
      <section className="card">
        <h2>Service Links</h2>
        <ul>
          <li>Users: http://localhost:3001/health</li>
          <li>Payments: http://localhost:3002/health</li>
        </ul>
      </section>
    </div>
  );
}
