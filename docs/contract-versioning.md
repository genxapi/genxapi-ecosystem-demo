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

- `apps/users-service/package.json` version: `0.4.0`
- published contract: `docs/contracts/users-service/0.4.0.json`
- `docs/contracts/users-service/latest.json` also reports `info.version = 0.4.0`

`latest.json` is an alias for convenience. The reproducible CI path should resolve it to the immutable versioned snapshot and generate from `docs/contracts/users-service/0.4.0.json`.

## Contract Version != SDK Package Version

The SDK package version is intentionally not synced to the contract version.

That means a users SDK release could look like:

- backend service version: `0.4.0`
- contract version: `0.4.0`
- SDK package version: `0.5.0`

This is valid because the SDK package is its own released product.

The SDK can still be generated from a contract that reports `0.4.0`, but the package released to consumers follows SDK release ownership.

## Why This Matters

This boundary keeps responsibilities realistic:

- backend teams do not give up release ownership to GenX API
- contracts remain trustworthy release artefacts from the service lifecycle
- SDK teams can version and publish clients independently
- consumer applications can choose when to upgrade SDK dependencies

`publish-contract` should therefore be wired into backend release automation, not into GenX API generation or consumer build steps.

## Local Demo Flow

To show the service-owned contract side:

```bash
npm run demo:contracts
```

In the demo, this stands in for the backend release pipeline step that publishes versioned contract artefacts.

To show the SDK side:

```bash
npm run demo:sdks
```

To show browser consumer adoption:

```bash
npm run build:browser-apps
```

Those app builds depend on the built SDK packages being present, but they do not trigger contract publication or SDK generation automatically.

`mobile-app` follows the same boundary, but it is served through Expo with explicit `EXPO_PUBLIC_*` service URLs instead of the Vite proxy setup used by the browser apps.
