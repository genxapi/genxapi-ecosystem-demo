# @genxapi/ecosystem-users-sdk

Generated users client plus a thin handwritten runtime adapter.

## Generated vs handwritten

- `src/users/**` and `swagger-spec.json` are generated from the published contract
- `src/runtime.ts`, `src/sdk.ts`, and `src/index.ts` are handwritten runtime bindings

## Usage

```ts
import { createUsersSdk } from '@genxapi/ecosystem-users-sdk';

const usersSdk = createUsersSdk({
  baseUrl: 'https://api.example.com/users',
  accessToken: async () => session.token,
});
```

Regenerate from the published contract:

```bash
npx nx run users-sdk:generate
```
