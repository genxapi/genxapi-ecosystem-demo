# @genxapi-labs/ecosystem-payments-sdk

Generated payments SDK package plus a thin handwritten runtime adapter.

This package is part of the end-to-end workflow demonstrated in [`genxapi-ecosystem-demo`](https://github.com/genxapi/genxapi-ecosystem-demo): service-owned contract snapshot -> GenX API generation -> consumer app adoption.
It is demo-only. The core open source product packages stay under the `@genxapi/*` scope, while ecosystem demo artifacts live under `@genxapi-labs/*`.

## Generated vs handwritten

- `src/payments/**` and `swagger-spec.json` are generated from the published contract
- `src/runtime.ts`, `src/sdk.ts`, and `src/index.ts` are handwritten runtime bindings

## Usage

```ts
import { createPaymentsSdk } from '@genxapi-labs/ecosystem-payments-sdk';

const paymentsSdk = createPaymentsSdk({
  baseUrl: 'https://api.example.com/payments',
  accessToken: async () => session.token,
});
```

Regenerate from the published contract:

```bash
npx nx run payments-sdk:generate
```
