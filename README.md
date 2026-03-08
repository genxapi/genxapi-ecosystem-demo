# Genxapi Ecosystem Demo

This repository demonstrates the intended GenX API adoption model inside an Nx monorepo:

1. a backend team owns and releases a NestJS service
2. Swagger/OpenAPI is part of that service lifecycle
3. the released contract is published as a service-owned artefact
4. GenX API consumes that published contract
5. GenX API generates an SDK package
6. consumer apps adopt the SDK package explicitly

At the current stage, `web-app` is the only consumer integrated with the generated SDK packages.

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
- `docs/contracts/users-service`
  - published users-service contract artefacts
- `docs/contracts/payments-service`
  - published payments-service contract artefacts
- `sdk/users-sdk`
  - generated from the published users-service contract
- `sdk/payments-sdk`
  - generated from the published payments-service contract
- `apps/web-app`
  - consumer app that imports SDK packages through normal package boundaries

## Backend Contract Lifecycle

Each service resolves Swagger `info.version` from its own `package.json` version.

The services keep normal NestJS Swagger behavior:

- Swagger UI at `/swagger`
- Swagger JSON at `/swagger-json`
- Nx `export-swagger` targets for local export

Published contracts are created with dedicated service-owned targets:

- `nx run users-service:publish-contract`
- `nx run payments-service:publish-contract`

Those targets publish into:

- `docs/contracts/<service>/<version>.json`
- `docs/contracts/<service>/latest.json`

## Where GenX API Adds Value

GenX API does not create or publish the contract in this demo.

It starts from the published contract snapshot:

- `genxapi.users.config.json` reads `docs/contracts/users-service/latest.json`
- `genxapi.config.json` reads `docs/contracts/payments-service/latest.json`

That keeps contract production and SDK generation clearly separated.

## Local Demo Flow

Install dependencies:

```bash
npm install
```

Publish the current service contracts:

```bash
nx run users-service:publish-contract
nx run payments-service:publish-contract
```

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
- Users Swagger UI: `http://localhost:3001/swagger`
- Payments Swagger UI: `http://localhost:3002/swagger`

## Useful Commands

Export service Swagger locally:

```bash
nx run users-service:export-swagger
nx run payments-service:export-swagger
```

Publish service-owned contracts:

```bash
nx run users-service:publish-contract
nx run payments-service:publish-contract
```

Generate SDKs from published contracts:

```bash
nx run users-sdk:generate
nx run payments-sdk:generate
```

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
- GenX API generation from published contracts
- independently releasable SDK packages
- explicit package consumption in `web-app`

Not yet integrated:

- `backoffice-app` consuming SDK packages
- `mobile-app` consuming SDK packages
- a backend release automation tool such as semantic-release or Nx Release

## More Detail

- [docs/current-stage.md](docs/current-stage.md)
- [docs/contract-versioning.md](docs/contract-versioning.md)
