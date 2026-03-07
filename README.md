# Genxapi Ecosystem Demo

This repo is a minimal Nx monorepo that hosts the genxapi demo ecosystem:

- Backend services (NestJS + Swagger)
  - `users-service` (port 3001)
  - `payments-service` (port 3002)
- Consumers (React + Vite)
  - `web-app` (port 4200)
  - `backoffice-app` (port 4300)
- Mobile (React Native + Expo)
  - `mobile-app`

The goal is to keep everything hackathon-friendly while exposing Swagger endpoints and a place to store generated specs for genxapi.

## Quickstart

1. Install workspace dependencies:

```bash
npm install
```

2. Install Expo app dependencies:

```bash
npm install --prefix apps/mobile-app
```

3. Run services and apps:

```bash
nx serve users-service
nx serve payments-service
nx serve web-app
nx serve backoffice-app
nx serve mobile-app
```

For the local end-to-end demo, Nx can now refresh the generated SDKs and start the required processes with one command:

```bash
npm run serve:demo
```

## Web App Demo Journey

1. Start the services and web app:

```bash
npm run serve:demo
```

2. Visit the pages in the web app (default `http://localhost:4200`):

- Dashboard: health status cards for users and payments services.
- Users: searchable users list with navigation into user profiles.
- User details: profile card plus that user’s payments, with computed insights.
- Payments: full payments table with status and method filtering.

## Swagger

- Users service Swagger UI: `http://localhost:3001/swagger`
- Payments service Swagger UI: `http://localhost:3002/swagger`
- Users JSON: `http://localhost:3001/swagger-json`
- Payments JSON: `http://localhost:3002/swagger-json`

To pull the Swagger JSON into the repo for genxapi consumption:

```bash
npm run swagger:pull
```

This writes the specs to `docs/swagger/`.

## Users SDK

Local generation:

```bash
nx run users-sdk:generate
```

CI uses the "users-sdk" workflow. Use `workflow_dispatch` with `publish` set to `true` to publish the SDK.

## Local Nx SDK Flow

- `users-sdk` and `payments-sdk` are first-class Nx projects under `sdk/`.
- Nx orchestrates the flow, but genxapi still owns SDK refresh through each config's `beforeGenerate` hook, including the Swagger export step.
- `web-app` depends on both SDK projects, so `nx serve web-app` and `nx build web-app` trigger `genxapi generate` before starting.
- The root workspace installs both SDK packages from `sdk/`, so a fresh local `npm install` does not depend on unpublished registry packages.
- To refresh both SDKs without starting the app, run `npm run gen:sdks`.

## Local SDK Dependencies

The workspace now resolves both generated SDK packages locally by default so the full demo can run on a laptop without publishing either package first. The CI helper in `tools/ci/use-local-sdk.mjs` remains available for jobs that need to rewrite SDK package exports to source files.

## Nx Graph

To visualize the workspace:

```bash
nx graph
```
