# Contract And SDK Versioning

This repository demonstrates a strict version ownership boundary.

## Ownership Model

- Backend service version:
  owned by the backend service lifecycle
- OpenAPI contract version:
  aligned with the backend service version
- SDK package version:
  owned by the SDK release lifecycle
- Consumer dependency version:
  owned by the consuming application lifecycle

The key correction is this:

it is normal and desirable for the OpenAPI contract version to match the backend service version.

What must stay independent is the SDK package version.

## Service Version -> Contract Version

Each service resolves Swagger `info.version` from its own `package.json` version, with optional `API_VERSION` override support.

That means the published contract artefact reflects the backend release version directly.

Example:

- `apps/users-service/package.json` version: `0.2.0`
- published contract: `docs/contracts/users-service/0.2.0.json`
- `docs/contracts/users-service/latest.json` also reports `info.version = 0.2.0`

## Contract Version != SDK Package Version

The SDK package version is intentionally not synced to the contract version.

That means a users SDK release could look like:

- backend service version: `0.2.0`
- contract version: `0.2.0`
- SDK package version: `0.5.0`

This is valid because the SDK package is its own released product.

The SDK can still be generated from a contract that reports `0.2.0`, but the package released to consumers follows SDK release ownership.

## Why This Matters

This boundary keeps responsibilities realistic:

- backend teams do not give up release ownership to GenX API
- contracts remain trustworthy release artefacts from the service lifecycle
- SDK teams can version and publish clients independently
- consumer applications can choose when to upgrade SDK dependencies

## Local Demo Flow

To see the contract side:

```bash
nx run users-service:publish-contract
```

To see the SDK side:

```bash
nx run users-sdk:generate
nx run users-sdk:build
```

To see consumer adoption:

```bash
nx build web-app
```

The consumer build depends on the built SDK package being present, but it does not trigger SDK generation automatically.
