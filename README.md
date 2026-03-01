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

## Payments SDK

Local generation:

```bash
npm run gen:sdk:payments
```

CI uses the workflow named "Payments SDK". Use `workflow_dispatch` with `publish` set to `true` to publish the SDK.

## Nx Graph

To visualize the workspace:

```bash
nx graph
```
