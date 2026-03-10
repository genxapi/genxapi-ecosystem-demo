# Current Stage Guide

This repository now demonstrates the full role-aware GenX API ecosystem story inside one Nx workspace:

1. backend services own and publish contracts
2. GenX API generates SDKs from those published contracts
3. multiple consumers adopt the SDKs
4. JWT role claims control which journeys are valid in each app

## What Is In Scope Now

- service-owned Swagger generation and `publish-contract` targets
- published contract snapshots under `docs/contracts/`
- GenX API configs pointed at those published snapshots
- generated SDK packages under `sdk/`
- `web-app` as customer self-service in the browser
- `mobile-app` as the second customer self-service consumer
- `backoffice-app` as the internal support and admin consumer
- shared auth helpers in `libs/auth-client`

## Boundary Rules

- backend service version owns OpenAPI `info.version`
- published contract version stays aligned with the backend service version
- SDK package versioning stays independent from the service and contract version
- consumer apps adopt SDK packages explicitly and do not regenerate them during app startup
- apps own runtime base URLs, session storage, and bearer-token injection

## Recommended Local Flow

```bash
npm install
npm run demo:prepare
npm run demo:serve
```

Optional mobile demo:

```bash
cp apps/mobile-app/.env.example apps/mobile-app/.env
npm run demo:serve:mobile
```

Use the root README for the full live-demo runbook, persona guidance, and app-by-app walkthrough.

## Why The Boundary Matters

The important message is not "GenX API runs before every app build."

The important message is:

- services keep contract ownership
- published contracts become stable downstream inputs
- GenX API generates SDKs from those inputs
- consumer adoption remains a normal downstream lifecycle decision

That is the architecture this repository is designed to rehearse.
