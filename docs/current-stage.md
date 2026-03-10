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

In the intended lifecycle, `publish-contract` belongs in the backend service release pipeline. Running it manually in this repository is only a local stand-in for that release step.

### GenX API starts after publication

The GenX API configs now consume only published contracts.

They do not:

- call service export steps
- depend on live services
- own contract publication

SDK generation can therefore run with the services offline, as long as the published contract snapshots already exist.

For local development, the workspace configs point to `latest.json`.

For CI and publishing, the workflow first resolves `latest.json` to the matching immutable `docs/contracts/<service>/<version>.json` file and generates from that pinned snapshot.

### SDK release is separate from service release

The SDK package version is no longer forced to match the backend service or OpenAPI contract version.

The backend service version still aligns with the OpenAPI contract version.

The SDK package version is now an SDK release concern handled independently in the SDK workflow.

That workflow does not change the backend service version or the published contract version.

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

## Runtime Convention

The consumer-side runtime contract is now explicit:

- consumers resolve service base URLs at runtime
- consumers provide the bearer token source
- SDK packages expose small factories that bind those values once

`packages/demo-runtime` keeps the demo personas and shared runtime config shape aligned across the consumer stubs without moving auth UX into the generated SDKs.

## Future Nx Release Direction

If this repo adopts Nx Release later, the safe migration path is:

- one release group for backend services
- one release group for SDK packages

That keeps service version -> contract version aligned while leaving SDK package versioning independent.
