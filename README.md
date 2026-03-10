# Genxapi Ecosystem Demo

This repository demonstrates the intended GenX API adoption model inside an Nx monorepo:

1. a backend team owns and releases a NestJS service
2. Swagger/OpenAPI is part of that service lifecycle
3. the released contract is published as a service-owned artefact
4. GenX API consumes that published contract
5. GenX API generates an SDK package
6. consumer apps adopt the SDK package explicitly

At the current stage, `web-app` is the only consumer making live authenticated SDK calls. `backoffice-app` and `mobile-app` expose the same auth-service and SDK bootstrap shape but still stop short of full UI flows.

## Ownership Boundary

- Backend service version:
  owned by the backend service lifecycle
- OpenAPI contract version:
  aligned with the backend service version
- Published contract artefact:
  owned by the backend service lifecycle
- SDK package version:
  owned by the SDK release lifecycle
- Consumer dependency upgrades:
  owned by the consuming application lifecycle

GenX API starts only after the contract has already been published.

## Repository Shape

- `apps/users-service`
  - NestJS service on port `3001`
  - owns Swagger generation and contract publication
- `apps/payments-service`
  - NestJS service on port `3002`
  - owns Swagger generation and contract publication
- `apps/auth-service`
  - NestJS service on port `3003`
  - owns login, JWT issuance, and contract publication
- `docs/contracts/users-service`
  - published users-service contract artefacts
- `docs/contracts/payments-service`
  - published payments-service contract artefacts
- `docs/contracts/auth-service`
  - published auth-service contract artefacts
- `sdk/users-sdk`
  - generated from the published users-service contract
- `sdk/payments-sdk`
  - generated from the published payments-service contract
- `libs/auth-client`
  - shared auth-service client helpers and session types for consumers
- `apps/web-app`
  - consumer app that imports SDK packages through normal package boundaries
- `apps/backoffice-app`
  - internal consumer stub showing the auth-service and SDK bootstrap shape
- `apps/mobile-app`
  - mobile consumer stub showing the auth-service and SDK bootstrap shape

## Backend Contract Lifecycle

Each service resolves Swagger `info.version` from its own `package.json` version.

The services keep normal NestJS Swagger behavior:

- Swagger UI at `/swagger`
- Swagger JSON at `/swagger-json`
- Nx `export-swagger` targets for local export

Published contracts are created with dedicated service-owned targets:

- `nx run auth-service:publish-contract`
- `nx run users-service:publish-contract`
- `nx run payments-service:publish-contract`

These targets model a backend release concern. In a real service pipeline, they should run as part of the service release workflow after the service version has been resolved, not as part of SDK generation.

Those targets publish into:

- `docs/contracts/<service>/<version>.json`
- `docs/contracts/<service>/latest.json`

`latest.json` is only a convenience alias for local development. The documented CI path resolves that alias to `docs/contracts/<service>/<version>.json` and generates the SDK from the pinned versioned snapshot.

## Where GenX API Adds Value

GenX API does not create or publish the contract in this demo.

It starts from the published contract snapshot:

- `genxapi.users.config.json` reads `docs/contracts/users-service/latest.json`
- `genxapi.config.json` reads `docs/contracts/payments-service/latest.json`

That keeps contract production and SDK generation clearly separated locally, while CI pins generation to an immutable versioned contract file for reproducibility.

## Local Demo Flow

Install dependencies:

```bash
npm install
```

Publish the current service contracts:

```bash
nx run auth-service:publish-contract
nx run users-service:publish-contract
nx run payments-service:publish-contract
```

For the demo, those commands simulate the service release pipeline. They are not meant to imply that consumer apps or GenX API own contract publication.

Generate and build the SDK packages:

```bash
nx run users-sdk:build
nx run payments-sdk:build
```

Run the services and the consumer app:

```bash
npm run serve:demo
```

Open:

- Web app: `http://localhost:4200`
- Auth Swagger UI: `http://localhost:3003/swagger`
- Users Swagger UI: `http://localhost:3001/swagger`
- Payments Swagger UI: `http://localhost:3002/swagger`

## Demo Credentials

`web-app` now boots customer sessions with one-click demo personas backed by seeded `auth-service` accounts:

- Customer: `bob.smith@example.com` / `bob-demo-password`
- Customer: `ethan.williams@example.com` / `ethan-demo-password`

Support and admin accounts still exist in `auth-service`, but they are intentionally no longer part of the customer-facing `web-app` flow:

- Support: `diana.miller@example.com` / `diana-demo-password`
- Admin: `alice.johnson@example.com` / `alice-demo-password`

## Useful Commands

Export service Swagger locally:

```bash
nx run auth-service:export-swagger
nx run users-service:export-swagger
nx run payments-service:export-swagger
```

Publish service-owned contracts:

```bash
nx run auth-service:publish-contract
nx run users-service:publish-contract
nx run payments-service:publish-contract
```

Generate SDKs from published contracts:

```bash
nx run users-sdk:generate
nx run payments-sdk:generate
```

Those local generate targets use `latest.json` for convenience. The GitHub SDK workflows first resolve `latest.json` to a pinned `docs/contracts/<service>/<version>.json` snapshot and then generate from that immutable contract.

Build the SDK packages:

```bash
nx run users-sdk:build
nx run payments-sdk:build
```

Build the consumer app:

```bash
nx build web-app
```

Inspect the project graph:

```bash
nx graph
```

## Current Scope

Integrated now:

- service-owned Swagger generation
- service-owned contract publication
- auth-service login and JWT issuance
- GenX API generation from published contracts
- independently releasable SDK packages
- explicit package consumption in `web-app`
- app-owned session storage in `web-app`
- shared auth-service client helpers under `libs/auth-client`

Not yet integrated:

- `backoffice-app` login flow
- `backoffice-app` making live SDK requests
- `mobile-app` login flow
- `mobile-app` making live SDK requests
- a backend release automation tool such as semantic-release or Nx Release

If this repository migrates to Nx Release later, keep services and SDK packages in separate release groups so backend service versioning and SDK package versioning remain independent.

## Runtime Adoption

The repo now keeps one shared consumer-side convention for auth and SDK wiring:

- consumers authenticate against `auth-service`
- each app keeps its own session storage and backend URLs
- SDK packages are created once with a bearer token provider from that session
- shared auth request helpers live in `libs/auth-client`

## More Detail

- [docs/current-stage.md](docs/current-stage.md)
- [docs/contract-versioning.md](docs/contract-versioning.md)
