# Current Stage Guide

This document explains the repository as it exists after the architecture boundary correction.

## Purpose

The repo is meant to show how GenX API fits into a realistic backend-team workflow, not how GenX API can take over that workflow.

The intended sequence is:

1. backend team develops and releases a NestJS service
2. the service exposes Swagger/OpenAPI as part of its normal lifecycle
3. the service publishes a versioned contract artefact
4. GenX API generates an SDK from that published contract
5. the SDK package is versioned and released independently
6. consumer applications adopt the SDK explicitly

## What Is Preserved

- normal NestJS Swagger UI and JSON endpoints
- Nx targets for serving, building, and exporting service Swagger
- GenX API-driven SDK generation
- SDK packages under `sdk/`
- consumer imports through package names

## What Changed

### Backend lifecycle is independent

The services now read Swagger version metadata from their own `package.json` versions, with optional `API_VERSION` override support in CI.

That means:

- backend version ownership stays with the service
- OpenAPI `info.version` tracks backend service version
- GenX API does not own backend versioning

### Contract publication is explicit

Each service has a `publish-contract` target that turns exported Swagger into published contract artefacts:

- `docs/contracts/users-service/<version>.json`
- `docs/contracts/users-service/latest.json`
- `docs/contracts/payments-service/<version>.json`
- `docs/contracts/payments-service/latest.json`

These files represent the demo contract registry.

### GenX API starts after publication

The GenX API configs now consume only published contracts.

They do not:

- call service export steps
- depend on live services
- own contract publication

SDK generation can therefore run with the services offline, as long as the published contract snapshots already exist.

### SDK release is separate from service release

The SDK package version is no longer forced to match the backend service or OpenAPI contract version.

The backend service version still aligns with the OpenAPI contract version.

The SDK package version is now an SDK release concern handled independently in the SDK workflow.

### Consumer adoption is explicit

`web-app` no longer regenerates SDKs during `serve` or `build`.

It consumes the SDK packages through normal package exports, which means:

- package boundaries are respected
- the consumer does not secretly own SDK generation
- the demo looks closer to real downstream adoption

## Practical Flow

For a local run:

```bash
npm install
nx run users-service:publish-contract
nx run payments-service:publish-contract
nx run users-sdk:build
nx run payments-sdk:build
npm run serve:demo
```

For validating the consumer only:

```bash
nx build web-app
```

This succeeds only after the SDK packages have been built, which is intentional.

## What The Demo Is Showing

The important message is not "GenX API runs before every consumer build".

The important message is:

- backend teams can keep their existing release ownership
- published contracts become stable inputs
- GenX API can generate SDKs from those stable inputs
- SDK release and consumer adoption remain normal downstream lifecycle concerns
