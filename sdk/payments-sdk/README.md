# genxapi-ecosystem-payments-sdk

Generated payments client plus a thin handwritten runtime adapter.

## Generated vs handwritten

- `src/payments/**` and `swagger-spec.json` are generated from the published contract
- `src/runtime.ts`, `src/sdk.ts`, and `src/index.ts` are handwritten runtime bindings

## Usage

```ts
import { createPaymentsSdk } from 'genxapi-ecosystem-payments-sdk';

const paymentsSdk = createPaymentsSdk({
  baseUrl: 'https://api.example.com/payments',
  accessToken: async () => session.token,
});
```

Regenerate from the published contract:

```bash
npx nx run payments-sdk:generate
```
