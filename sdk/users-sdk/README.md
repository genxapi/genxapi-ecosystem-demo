# @genxapi-labs/ecosystem-users-sdk

Generated users SDK package plus a thin handwritten runtime adapter.

This package is demo-only. The core open source product packages stay under the `@genxapi/*` scope, while ecosystem demo artifacts live under `@genxapi-labs/*`.

This package is part of the end-to-end workflow demonstrated in [`genxapi-ecosystem-demo`](https://github.com/genxapi/genxapi-ecosystem-demo): service-owned contract snapshot -> GenX API generation -> consumer app adoption.

## Generated vs handwritten

- `src/users/**` and `swagger-spec.json` are generated from the published contract
- `src/runtime.ts`, `src/sdk.ts`, and `src/index.ts` are handwritten runtime bindings

## Usage

```ts
import { createUsersSdk } from '@genxapi-labs/ecosystem-users-sdk';

const usersSdk = createUsersSdk({
  baseUrl: 'https://api.example.com/users',
  accessToken: async () => session.token,
});
```

Regenerate from the published contract:

```bash
npx nx run users-sdk:generate
```
