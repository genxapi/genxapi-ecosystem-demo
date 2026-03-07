# Contract Versioning Flow

This document describes the shift-left API client generation story that this example now demonstrates.

## Objective

When a backend contract changes, the SDK generated from that contract should not remain an ambiguous "latest" artifact. It should become a concrete package version that downstream consumers can adopt deliberately.

That is the behavior this repository now models.

## Source Of Truth

Each backend service owns a contract descriptor:

- `apps/users-service/src/contract.ts`
- `apps/payments-service/src/contract.ts`

Those files define:

- contract title
- contract description
- contract version

When the backend introduces a contract change, the service contract version should be bumped there.

## What Happens After A Contract Change

1. A backend service changes in a way that affects its API contract.
2. The service contract version is bumped.
3. `genxapi generate` runs for the corresponding SDK.
4. The `beforeGenerate` hook refreshes the Swagger contract first.
5. `genxapi` generates the SDK from the refreshed contract.
6. The repo syncs the SDK package version to the generated contract version.

That produces a direct chain:

- backend contract version
- generated OpenAPI version
- generated SDK package version

## Why This Matters

This is the shift-left value:

- contract changes are surfaced early
- SDKs are regenerated immediately from the new contract
- package versioning is tied to the contract, not added later as an unrelated release concern
- downstream consumers can adopt a specific version instead of guessing what changed

## Local Demo Behavior

Locally, this repository still uses file-based SDK dependencies so the demo can run without publishing packages first.

That means:

- local development consumes `file:sdk/users-sdk`
- local development consumes `file:sdk/payments-sdk`

But the SDK package version is still meaningful, because it represents the version that would be published and adopted by downstream consumers.

## Publish Behavior

The GitHub SDK workflows now preserve the contract-driven SDK package version.

They no longer replace it with synthetic demo-only versions before publish.

That keeps the story coherent:

- contract changes create a new SDK version
- publish uses that version
- consumers adopt that version

## How To Try It

Example with `users-service`:

1. Change the API contract in `apps/users-service`.
2. Bump the version in `apps/users-service/src/contract.ts`.
3. Regenerate the SDK:

```bash
nx run users-sdk:generate
```

4. Inspect:

- `docs/swagger/users-service.json`
- `sdk/users-sdk/swagger-spec.json`
- `sdk/users-sdk/package.json`

You should see the same version flow through those artifacts.

## Adoption Story

In a downstream consumer that installs from a registry, adoption would look like a normal package upgrade:

```json
{
  "dependencies": {
    "@genxapi/ecosystem-users-sdk": "^0.2.0"
  }
}
```

If the backend contract evolves and the generated SDK becomes `0.3.0`, the consumer can choose when to adopt that newer SDK version.

That is the core point being demonstrated here: `genxapi` turns backend contract evolution into explicit client package evolution.
