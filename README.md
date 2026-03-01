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

## Web App Demo Journey

1. Start the services and web app:

```bash
nx serve users-service
nx serve payments-service
nx serve web-app
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
npm run gen:sdk:users
```

CI uses the "users-sdk" workflow. Use `workflow_dispatch` with `publish` set to `true` to publish the SDK.

## Local SDK Dependencies

The repo targets published SDK versions for production installs. If you need to run the genxapi-generate action before the SDKs are published, set the action input `useLocalSdk: "true"` so it temporarily rewrites dependencies to use the local SDK sources for that CI job.

## Nx Graph

To visualize the workspace:

```bash
nx graph
```
